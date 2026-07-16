import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Image, StyleSheet } from 'react-native'; 
import { getFirestore, collection, getDocs, query } from 'firebase/firestore'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { getAuth } from 'firebase/auth'; 

export const ListUsers = () => { 
  const [users, setUsers] = useState([]); 
  const db = getFirestore(); 
  const auth = getAuth(); 
  const navigation = useNavigation(); 

  useFocusEffect( 
    React.useCallback(() => { 
      const fetchUsers = async () => { 
        try { 
          const q = query(collection(db, "user_data")); 
          const querySnapshot = await getDocs(q); 
          const fetchedUsers = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(), 
          })); 
          
          const currentUser = fetchedUsers.find((user) => user.email === auth.currentUser?.email); 
          const otherUsers = fetchedUsers.filter((user) => user.email !== auth.currentUser?.email); 
          
          // Fallback array filter in case currentUser isn't found right away
          const finalUsersList = currentUser ? [currentUser, ...otherUsers] : otherUsers;
          setUsers(finalUsersList); 
        } catch (error) { 
          console.error('Error fetching users:', error); 
        } 
      }; 
      fetchUsers(); 
    }, [db, auth]) 
  ); 

  return ( 
    <FlatList 
      data={users} 
      keyExtractor={item => item.id} 
      renderItem={({ item }) => ( 
        <View> 
          <Pressable 
            style={styles.userContainer} 
            onPress={() => navigation.navigate('PostifyPostsList', { poster: item.email })} 
          > 
            <Image 
              source={{ 
                uri: item.avatar ? item.avatar : 'https://randomuser.me/api/portraits/lego/1.jpg', 
              }} 
              style={[ 
                styles.avatar, 
                item.email === auth.currentUser?.email && styles.currentUserAvatarBorder 
              ]} 
            /> 
            <Text style={styles.username}> 
              {item.displayName ? item.displayName : item.email} 
            </Text> 
          </Pressable> 
        </View> 
      )} 
    /> 
  ); 
};

const styles = StyleSheet.create({ 
  userContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, }, 
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', }, 
  avatar: { width: 50, height: 50, borderRadius: 20, marginRight: 10, }, 
  username: { fontSize: 20, color: 'blue', }, 
  currentUserAvatarBorder: { borderColor: 'purple', borderWidth: 3 } 
});