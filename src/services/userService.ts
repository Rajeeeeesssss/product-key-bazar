
import { db } from '@/lib/firestore';
import type { User as AuthUser } from 'firebase/auth';
import type { User } from '@/lib/types';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';

export async function addUser(authUser: AuthUser) {
    const userRef = doc(db, 'users', authUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        // Use a default for displayName if it's null, which can happen in email/password signup
        const displayName = authUser.displayName || authUser.email?.split('@')[0] || 'New User';
        
        const newUser: User = {
            uid: authUser.uid,
            email: authUser.email,
            displayName: displayName,
            photoURL: authUser.photoURL,
            role: 'user', // Default role
            disabled: false,
        };
        await setDoc(userRef, newUser);
    }
}

export async function getUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    } as User));
    return userList;
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
}
