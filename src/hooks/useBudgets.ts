import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Budget } from '../types';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        period: doc.data().period?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Budget[];
      
      setBudgets(budgetsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    await addDoc(collection(db, 'budgets'), {
      ...budgetData,
      userId: currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const updateBudget = async (budgetId: string, updates: Partial<Budget>) => {
    await updateDoc(doc(db, 'budgets', budgetId), {
      ...updates,
      updatedAt: new Date(),
    });
  };

  const deleteBudget = async (budgetId: string) => {
    await deleteDoc(doc(db, 'budgets', budgetId));
  };

  return { budgets, loading, addBudget, updateBudget, deleteBudget };
};