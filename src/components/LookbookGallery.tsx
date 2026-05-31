import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, signInWithGoogle } from '../firebase';
import { useFirebase } from './FirebaseProvider';
import { Album, Photo } from '../types';
import { 
  FolderPlus, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Sparkles, 
  Upload, 
  Folder, 
  Grid, 
  Lock, 
  User as UserIcon,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LookbookGallery() {
  const { user } = useFirebase();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string>('');
  const [newAlbumName, setNewAlbumName] = useState<string>('');
  const [newAlbumDesc, setNewAlbumDesc] = useState<string>('');
  const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
  
  const [isCreatingAlbum, setIsCreatingAlbum] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [compressing, setCompressing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Listen for User's Albums
  useEffect(() => {
    if (!user) {
      setAlbums([]);
      setActiveAlbumId('');
      return;
    }

    const path = 'albums';
    const q = query(
      collection(db, path),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Album[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Album);
        });
        setAlbums(list);
        if (list.length > 0 && !activeAlbumId) {
          setActiveAlbumId(list[0].id);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  }, [user]);

  // 2. Listen for Photos of Current Active Album
  useEffect(() => {
    if (!user || !activeAlbumId) {
      setPhotos([]);
      return;
    }

    const path = 'photos';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      where('albumId', '==', activeAlbumId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Photo[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Photo);
        });

        // CRITICAL REQUIREMENT: Perform sorting (createdAt desc) in-memory 
        // after fetching to avoid requiring manual Firestore indexes.
        const sorted = list.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt || 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt || 0);
          return timeB - timeA;
        });

        setPhotos(sorted);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  }, [user, activeAlbumId]);

  // 3. Create a New Album
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newAlbumName.trim()) return;

    const albumId = 'album-' + Math.floor(100000 + Math.random() * 900000);
    const newAlbum: Album = {
      id: albumId,
      name: newAlbumName.trim(),
      ownerId: user.uid,
      description: newAlbumDesc.trim() || undefined,
      createdAt: serverTimestamp() // triggers server timestamp validation
    };

    try {
      await setDoc(doc(db, 'albums', albumId), newAlbum);
      setNewAlbumName('');
      setNewAlbumDesc('');
      setIsCreatingAlbum(false);
      setActiveAlbumId(albumId);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `albums/${albumId}`);
    }
  };

  // 4. Delete Lookbook Album & associated photos
  const handleDeleteAlbum = async (albumId: string) => {
    if (!confirm("Are you sure you want to delete this custom Lookbook album? All containing snapshots will be cleared permanently.")) return;
    if (!user) return;

    try {
      // 1. Remove album record
      await deleteDoc(doc(db, 'albums', albumId));

      // 2. Delete the containing snaps (in practice custom client rules triggers delete or we manually clear)
      for (const ph of photos) {
        if (ph.albumId === albumId) {
          await deleteDoc(doc(db, 'photos', ph.id));
        }
      }

      setAlbums((prev) => {
        const filtered = prev.filter((a) => a.id !== albumId);
        if (filtered.length > 0) {
          setActiveAlbumId(filtered[0].id);
        } else {
          setActiveAlbumId('');
        }
        return filtered;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `albums/${albumId}`);
    }
  };

  // 5. Compress Lookbook Snap (Variable JPEG Compression & Dimension Scaling Canvas utility)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        if (!base64Url) {
          reject(new Error("Unable to read image snapshot. File type may be unsupported."));
          return;
        }

        // Return immediately if it already fits inside 1,048,487 characters (under Firestore document limit)
        if (base64Url.length < 1048487) {
          resolve(base64Url);
          return;
        }

        setCompressing(true);
        const img = new Image();
        img.src = base64Url;
        img.onload = () => {
          // Calculate fluid dimensions bound to a max value of 1600px
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Unable to launch off-screen canvas rendering engine."));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Variable JPEG compression loop until file fits securely in under 1,048,487 characters
          let quality = 0.85;
          let result = canvas.toDataURL('image/jpeg', quality);
          while (result.length >= 1048487 && quality > 0.1) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          // Fallback dimension reduction if compression alone is insufficient
          if (result.length >= 1048487) {
            const innerMax = 900;
            let w2 = img.width;
            let h2 = img.height;
            if (w2 > innerMax || h2 > innerMax) {
              if (w2 > h2) {
                h2 = Math.round((h2 * innerMax) / w2);
                w2 = innerMax;
              } else {
                w2 = Math.round((w2 * innerMax) / h2);
                h2 = innerMax;
              }
            }
            const innerCanvas = document.createElement('canvas');
            innerCanvas.width = w2;
            innerCanvas.height = h2;
            const innerCtx = innerCanvas.getContext('2d');
            if (innerCtx) {
              innerCtx.drawImage(img, 0, 0, w2, h2);
              result = innerCanvas.toDataURL('image/jpeg', 0.5);
            }
          }

          setCompressing(false);
          resolve(result);
        };
        img.onerror = (err) => {
          setCompressing(false);
          reject(err);
        };
      };
      reader.onerror = (err) => {
        setCompressing(false);
        reject(err);
      };
    });
  };

  // 6. Handle Lookbook Snap Selection & Upload
  const handlePhotoUpload = async (file: File) => {
    if (!user || !activeAlbumId) return;
    setUploadError('');

    // CRITICAL REQUIREMENT: Limit upload size up to 4MB at client entry-point
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("This file size exceeds the strict 4MB platform limit. Please select a smaller snap.");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const compressedBase64 = await compressImage(file);
      const photoId = 'snap-' + Math.floor(100000 + Math.random() * 900000);
      const photoTitle = newPhotoTitle.trim() || file.name.split('.')[0] || "Custom Lookbook Style";

      const newPhoto: Photo = {
        id: photoId,
        albumId: activeAlbumId,
        userId: user.uid,
        url: compressedBase64,
        createdAt: serverTimestamp(),
        title: photoTitle
      };

      await setDoc(doc(db, 'photos', photoId), newPhoto);
      setNewPhotoTitle('');
    } catch (error: any) {
      setUploadError(error?.message || "Snapshot Upload failed. Please verify your connection or photo size.");
      handleFirestoreError(error, OperationType.CREATE, `photos/snapId`);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this lookbook snapshot from your collection?")) return;
    try {
      await deleteDoc(doc(db, 'photos', photoId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `photos/${photoId}`);
    }
  };

  // Drag and Drop styling events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  const activeAlbum = albums.find((a) => a.id === activeAlbumId);

  return (
    <section id="story-gallery" className="py-24 bg-neutral-950 dark:bg-black text-white relative border-t border-neutral-900 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-gold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
              Interactive Experience
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl hover:text-brand-orange transition-colors duration-350 tracking-wide text-white mb-4">
            Custom Style Lookbooks
          </h2>
          <p className="text-neutral-400 font-light text-xs sm:text-sm leading-relaxed">
            Create custom lookbook albums, upload your snaps, and currate your personal styles.
            Your uploads are compressed live and secured using Zero-Trust Firestore Security.
          </p>
        </div>

        {!user ? (
          /* Locked State for Unauthorized Users */
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center relative backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-gold p-0.5 mx-auto mb-6 shadow-lg shadow-black/50 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-2-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-brand-gold" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Private Curator Closet</h3>
            <p className="text-neutral-400 font-light text-xs leading-relaxed mb-6">
              Sign in with your Google account to create lookbooks, upload outfit inspirations, and manage style folders.
            </p>
            <button
              onClick={signInWithGoogle}
              className="py-3 px-6 w-full rounded-full bg-gradient-to-r from-brand-orange to-brand-gold hover:from-brand-gold hover:to-brand-orange text-black font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-brand-orange/10 transform active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              Sign In to Build Style Albums
            </button>
          </div>
        ) : (
          /* Logged In Workspace */
          <div id="closed-workspace" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT BAR: Albums List Selector */}
            <div className="lg:col-span-1 bg-neutral-900/30 border border-neutral-800/80 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                  <h3 className="text-white font-serif font-bold text-sm flex items-center gap-2">
                    <Folder className="w-4 h-4 text-brand-gold" />
                    My Lookbooks
                  </h3>
                  <button
                    onClick={() => setIsCreatingAlbum(!isCreatingAlbum)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 hover:text-brand-orange transition-colors duration-200"
                    title="New Lookbook Folder"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isCreatingAlbum && (
                  <motion.form 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCreateAlbum}
                    className="mb-6 p-4 rounded-2xl bg-neutral-900/60 border border-brand-orange/20 space-y-3"
                  >
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                        Folder Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Street Sneakers 2026"
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-brand-orange/60 text-xs text-white placeholder-neutral-600 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                        Curation Description
                      </label>
                      <textarea
                        placeholder="Explain the aesthetic..."
                        value={newAlbumDesc}
                        onChange={(e) => setNewAlbumDesc(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-brand-orange/60 text-xs text-white placeholder-neutral-600 outline-none transition-colors resize-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsCreatingAlbum(false)}
                        className="py-1 px-3.5 rounded-full hover:bg-neutral-800 text-neutral-400 text-[10px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1 px-4 rounded-full bg-brand-orange hover:bg-brand-gold text-black font-semibold text-[10px] transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Album Folders list */}
                {albums.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <FolderPlus className="w-8 h-8 mx-auto mb-2 opacity-30 text-brand-gold" />
                    <p className="text-[10px] font-light leading-relaxed">
                      No Lookbook Folders created yet. Click the + icon above to start your first fit album.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                    {albums.map((alb) => (
                      <div
                        key={alb.id}
                        className={`group w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 text-left border ${
                          activeAlbumId === alb.id 
                            ? 'bg-neutral-900 text-brand-gold border-brand-gold/30' 
                            : 'bg-transparent text-neutral-300 border-transparent hover:bg-neutral-900/40 hover:text-white'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActiveAlbumId(alb.id);
                            setUploadError('');
                          }}
                          className="flex-1 text-left truncate"
                        >
                          <span className="text-xs font-semibold block truncate">
                            {alb.name}
                          </span>
                          {alb.description && (
                            <span className="text-[9px] opacity-60 block truncate font-light mt-0.5">
                              {alb.description}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlbum(alb.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-800 hover:text-red-400 transition-all duration-200 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status footer for active user */}
              <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-6 h-6 rounded-full object-cover border border-neutral-800" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange text-[9px] font-bold">
                      {user.displayName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-[9px] text-neutral-400 block font-light leading-none">Curating as</span>
                    <span className="text-[10px] font-semibold text-white truncate max-w-[100px] block leading-normal mt-0.5">{user.displayName || user.email}</span>
                  </div>
                </div>
                <div className="text-[8px] uppercase tracking-widest text-brand-orange font-mono font-bold bg-brand-orange/10 px-2 py-0.5 rounded-full">
                  Verified Auth
                </div>
              </div>

            </div>

            {/* RIGHT WORKSPACE: Active Album Gallery grid */}
            <div className="lg:col-span-3 space-y-6">
              {activeAlbum ? (
                <div>
                  
                  {/* Album Info Bar */}
                  <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-800/80 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-white tracking-wide">
                        {activeAlbum.name}
                      </h3>
                      {activeAlbum.description && (
                        <p className="text-neutral-400 text-xs font-light mt-1">
                          {activeAlbum.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">Contains</span>
                        <span className="text-xs font-mono font-bold text-brand-gold mt-0.5 block">{photos.length} Snaps</span>
                      </div>
                    </div>
                  </div>

                  {/* DROPZONE UPLOADER */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative p-8 rounded-3xl border-2 border-dashed transition-all duration-300 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      dragActive 
                        ? 'border-brand-orange bg-brand-orange/5 scale-101' 
                        : 'border-neutral-800 bg-neutral-900/10 hover:border-neutral-700 hover:bg-neutral-900/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="outfit-file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <AnimatePresence>
                      {isUploadingPhoto || compressing ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center"
                        >
                          <Loader2 className="w-8 h-8 text-brand-orange animate-spin mb-3" />
                          <p className="text-xs text-white font-medium">
                            {compressing ? "High-performance base64 compressing in progress..." : "Storing secure snapshot in Firestore..."}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-light mt-1">
                            Fitting size securely under the 1MB document threshold!
                          </p>
                        </motion.div>
                      ) : (
                        <div className="space-y-1">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-brand-gold flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-300">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs text-white font-semibold">
                            Drag & Drop your lookbook snap here, or <span className="text-brand-orange font-bold">browse</span>
                          </p>
                          <p className="text-[10px] text-neutral-400 font-light">
                            Supports PNG, JPEG, WEBP up to 4MB records. Compressed live dynamically.
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ERRORS */}
                  {uploadError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-950/40 border border-red-950 text-red-400 text-xs flex items-center gap-2 mt-4"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </motion.div>
                  )}

                  {/* GALLERY PHOTOS GRID */}
                  <div className="mt-8">
                    {photos.length === 0 ? (
                      <div className="text-center py-24 bg-neutral-900/10 border border-neutral-900/50 rounded-3xl p-8">
                        <ImageIcon className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                        <h4 className="font-serif font-bold text-white text-base mb-1">Lookbook is Empty</h4>
                        <p className="text-neutral-500 font-light text-xs max-w-sm mx-auto">
                          Choose an eye-catching title option or browse your computer to upload style snap records to this folder.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                          {photos.map((ph, idx) => (
                            <motion.div
                              key={ph.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.45, delay: idx * 0.05 }}
                              layout
                              className="group relative rounded-3xl border border-neutral-900 p-2.5 bg-neutral-950 overflow-hidden shadow-xl"
                            >
                              <div className="relative aspect-square rounded-2-2xl overflow-hidden bg-neutral-900">
                                <img
                                  src={ph.url}
                                  alt={ph.title}
                                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 filter brightness-95"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                
                                {/* Overlay deletion */}
                                <button
                                  onClick={() => deletePhoto(ph.id)}
                                  className="absolute top-3 right-3 p-2 bg-neutral-950/80 hover:bg-red-950/80 hover:text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                                  title="Delete snapshot"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Card footer details */}
                              <div className="p-3">
                                <h4 className="font-sans font-bold text-xs text-white truncate">
                                  {ph.title}
                                </h4>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[8px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                                    LOOKBOOK ITEM
                                  </span>
                                  <span className="text-[9px] font-mono text-neutral-500 font-light">
                                    {ph.createdAt?.seconds 
                                      ? new Date(ph.createdAt.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                                      : 'Recently Uploaded'
                                    }
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Select or create dialog empty workspace state */
                <div className="text-center py-24 bg-neutral-900/10 border border-neutral-900/50 rounded-3xl p-8 backdrop-blur-sm">
                  <Grid className="w-16 h-16 text-brand-gold/20 mx-auto mb-4" />
                  <h3 className="font-serif font-bold text-white text-lg mb-2">My Designer Style Lookbook</h3>
                  <p className="text-neutral-500 font-light text-xs max-w-md mx-auto mb-6">
                    Launch a style lookbook album folder on your left panel, select your target workspace, and begin uploading lookbook style snapshots.
                  </p>
                  <button
                    onClick={() => setIsCreatingAlbum(true)}
                    className="py-2.5 px-6 rounded-full border border-brand-orange/40 hover:bg-brand-orange hover:text-black font-semibold text-xs text-brand-orange transition-all duration-300 transform active:scale-95"
                  >
                    Build My First Lookbook Folder
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
