import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { SavingsGoal } from '../types';

export const useSavingsGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'savingsGoals'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        deadline: doc.data().deadline?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as SavingsGoal[];
      
      setGoals(goalsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addGoal = async (goalData: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    await addDoc(collection(db, 'savingsGoals'), {
      ...goalData,
      userId: currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const updateGoal = async (goalId: string, updates: Partial<SavingsGoal>) => {
    await updateDoc(doc(db, 'savingsGoals', goalId), {
      ...updates,
      updatedAt: new Date(),
    });
  };

  const deleteGoal = async (goalId: string) => {
    await deleteDoc(doc(db, 'savingsGoals', goalId));
  };

  return { goals, loading, addGoal, updateGoal, deleteGoal };
};