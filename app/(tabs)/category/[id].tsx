// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { Colors } from '@/constants/Colors';
// import { Stack, useLocalSearchParams } from 'expo-router';
// import React, { useState } from 'react';
// import { View, StyleSheet, TextInput, FlatList, Button } from 'react-native';
// import { Text } from 'tamagui'; 
// import { Card } from 'tamagui';

// const clientsData = [
//   { id: '1', name: 'Joseph', vendorCode: 'V001', startDate: '2023-01-01', endDate: '2024-01-01' },
//   { id: '2', name: 'Mohamed Irfan', vendorCode: 'V002', startDate: '2023-02-01', endDate: '2024-02-01' },
//   { id: '3', name: 'Abdullah', vendorCode: 'V003', startDate: '2023-03-01', endDate: '2024-03-01' },
// ];

// const ClientDetailsScreen = () => {
//   const {id}=useLocalSearchParams()

//   const [searchText, setSearchText] = useState('');
//   const [filteredClients, setFilteredClients] = useState(clientsData);

//   const handleSearch = () => {
//     const filtered = clientsData.filter(client =>
//       client.name.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredClients(filtered);
//   };

//   const category="Agreements"
//   return (
//     <ThemedView style={styles.container}>
//       <Stack.Screen options={{title:'Client Details'}}/>
//       <ThemedView style={styles.header}>
//         <ThemedText style={styles.title}>{id} Clients </ThemedText>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by client name"
//           value={searchText}
//           onChangeText={setSearchText}
//           onSubmitEditing={handleSearch}
//         />
//       </ThemedView>

//       <ThemedView style={styles.filters}>
//         <Button title="Filter by Start Date" onPress={() => {/* Add filtering logic here */}} />
//         <Button title="Filter by End Date" onPress={() => {/* Add filtering logic here */}} />
//       </ThemedView>

//       <FlatList
//         data={filteredClients}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <Card theme={'alt2'}  elevate size="$7" bordered style={styles.clientCard}>
//             <Text style={styles.clientName}>{item.name}</Text>
//             <Text>Vendor Code: {item.vendorCode}</Text>
//             <Text>Start Date: {item.startDate}</Text>
//             <Text>End Date: {item.endDate}</Text>
//           </Card>
//         )}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </ThemedView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     color:'black',
//     backgroundColor:Colors.light.background
//   },
//   filters: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   clientCard: {
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     backgroundColor: '#ffffff',
//     elevation: 3, 
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//   },
//   clientName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default ClientDetailsScreen;


// app/category/[id].tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { agreementsData, insuranceRenewalData, onboardingData, purchaseOrderData, visaDetailsData } from '@/utils/datasets';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Button, FlatList, StyleSheet } from 'react-native';
import Item from './Item';

const categoryDataMap: Record<string, any[]> = {
  Agreements: agreementsData,
  "Purchase Order": purchaseOrderData,
  "Visa Details": visaDetailsData,
  "Onboarding Consultant": onboardingData,
  "Insurance Renewals": insuranceRenewalData,
};

const CategoryPage = () => {
  // const router = useRouter();
  const { id: category } = useLocalSearchParams<{id:string}>();
  const data = categoryDataMap[category];
  return (
    <ThemedView style={styles.container}>
       <Stack.Screen options={{title:'Client Details'}}/>
       <ThemedText style={styles.itemText}>{category} Clients </ThemedText>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Item item={item} category={category} />}
                contentContainerStyle={styles.listContent}
      />
      <Button
        title="Add New Entry"
        // onPress={() => router.push(`/add/${category}`)}
        color="#841584"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  itemText: {
    fontSize: 16,
  },
});

export default CategoryPage;
