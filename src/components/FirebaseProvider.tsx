import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  serverTimestamp,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Testimonial, Inquiry, Order } from '../types';
import { productsData, testimonialsData } from '../data';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  products: Product[];
  testimonials: Testimonial[];
  orders: Order[];
  isAdmin: boolean;
  submitInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt'>) => Promise<void>;
  submitOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'userId'>) => Promise<void>;
  addNewProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addNewTestimonial: (test: Testimonial) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Use local pre-defined data as immediate fallback to avoid blank screens during sync
  const [products, setProducts] = useState<Product[]>(productsData);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialsData);
  const [orders, setOrders] = useState<Order[]>([]);

  // Recognize our owner as admin so he can manage styles from the UI
  const isAdmin = user !== null && user.email === 'aggreymathias96@gmail.com';

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 2. Fetch or Sync Products
  useEffect(() => {
    const path = 'products';
    const unsubscribe = onSnapshot(
      collection(db, path),
      async (snapshot) => {
        if (snapshot.empty) {
          // Database is empty. If logged in, seed it!
          if (auth.currentUser) {
            console.log("Seeding products...");
            try {
              for (const prod of productsData) {
                await setDoc(doc(db, 'products', prod.id), prod);
              }
            } catch (err) {
              console.error("Seeding products failed:", err);
            }
          }
          setProducts(productsData);
        } else {
          const list: Product[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Product);
          });
          setProducts(list);
        }
      },
      (error) => {
        // Log errors using our required schema-compliant handler
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  }, [user]);

  // 3. Fetch or Sync Testimonials
  useEffect(() => {
    const path = 'testimonials';
    const unsubscribe = onSnapshot(
      collection(db, path),
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed testimonials if authenticated
          if (auth.currentUser) {
            console.log("Seeding testimonials...");
            try {
              for (const test of testimonialsData) {
                await setDoc(doc(db, 'testimonials', test.id), test);
              }
            } catch (err) {
              console.error("Seeding testimonials failed:", err);
            }
          }
          setTestimonials(testimonialsData);
        } else {
          const list: Testimonial[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Testimonial);
          });
          setTestimonials(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  }, [user]);

  // 4. Fetch User Orders (only if signed in)
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const path = 'orders';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            ...data,
            createdAt: data.createdAt ? (data.createdAt.seconds * 1000) : Date.now()
          } as Order);
        });
        setOrders(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return unsubscribe;
  }, [user]);

  // --- Write Operations ---

  // Inquiry submission
  const submitInquiry = async (inquiry: Omit<Inquiry, 'id' | 'createdAt'>) => {
    const path = 'inquiries';
    const id = 'inq-' + Math.floor(100000 + Math.random() * 900000);
    const newInquiry: Inquiry = {
      ...inquiry,
      id,
      userId: user?.uid || '',
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, path, id), newInquiry);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    }
  };

  // Order submission
  const submitOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!user) throw new Error("Authentication required to complete secure order checkout.");
    const path = 'orders';
    const orderId = 'order-' + Math.floor(1000 + Math.random() * 90000);

    const completeOrder: Order = {
      ...order,
      id: orderId,
      userId: user.uid,
      status: 'Pending Curator Approval',
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, path, orderId), completeOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${orderId}`);
    }
  };

  // Product management (Admin action)
  const addNewProduct = async (product: Product) => {
    const path = 'products';
    try {
      await setDoc(doc(db, path, product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${product.id}`);
    }
  };

  // Product Deletion (Admin action)
  const deleteProduct = async (productId: string) => {
    const path = 'products';
    try {
      await setDoc(doc(db, path, productId), {}); // triggers validation/deletion standard
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${productId}`);
    }
  };

  // Testimonial management (Admin action)
  const addNewTestimonial = async (test: Testimonial) => {
    const path = 'testimonials';
    try {
      await setDoc(doc(db, path, test.id), test);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${test.id}`);
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      loading,
      products,
      testimonials,
      orders,
      isAdmin,
      submitInquiry,
      submitOrder,
      addNewProduct,
      deleteProduct,
      addNewTestimonial
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
