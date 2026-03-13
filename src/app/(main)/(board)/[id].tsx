import { useBoardStore } from '@/store/useBoardStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

export default function BoardDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { boards, isLoading, fetchBoards } = useBoardStore();

  useEffect(() => {
    if (!boards.length) fetchBoards();
  }, []);

  const board = useMemo(() => boards.find((b) => b.id === id), [boards, id]);

  // Color de fondo principal (Pastel de la referencia)
  const bgColor = board?.color ?? '#fff';


  if (isLoading && !board) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#4F86F7" />
      </View>
    );
  }

  if (!board) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-8">
        <Stack.Screen options={{ title: 'Not Found', headerShown: false }} />
        <Text className="text-2xl font-bold tracking-tighter text-slate-900">404</Text>
        <Text className="mb-6 text-center text-slate-500">Board not found</Text>
        <Pressable className="rounded-full bg-slate-900 px-8 py-3" onPress={() => router.back()}>
          <Text className="font-bold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
    
      <View className="px-8 pt-16 pb-8 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.back()}
          className="w-12 h-12 bg-white/40 rounded-full items-center justify-center border border-white/20"
        >
          <Text className="text-xl font-bold text-slate-900">←</Text>
        </Pressable>
        
        <View className="items-center">
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900/40">Project</Text>
          <Text className="text-xl font-bold text-slate-900 tracking-tighter">{board.title}</Text>
        </View>

        <View className="w-12 h-12 bg-white/40 rounded-full items-center justify-center border border-white/20">
          <Text className="text-xl font-bold text-slate-900">⋮</Text>
        </View>
      </View>

      {/* Canvas Principal - Aquí irán las Listas */}
      <View className="flex-1 bg-white rounded-t-[50px] px-6 pt-10 shadow-2xl shadow-black/10">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          
          {/* Placeholder de Lista (Bento Style) */}
          <View className="w-72 mr-6 h-full">
            <View className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 items-center justify-center h-64 border-dashed">
              <View className="w-16 h-16 bg-slate-200/50 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl text-slate-400">+</Text>
              </View>
              <Text className="text-slate-900 font-bold text-lg tracking-tight">New List</Text>
              <Text className="text-slate-400 text-center text-xs mt-2 px-4">
                Add a column to start organizing your tasks
              </Text>
            </View>
          </View>

          {/* Puedes repetir el View anterior para simular varias columnas */}
        </ScrollView>
      </View>

      {/* Floating Action Button para nueva tarea */}
      <View className="absolute bottom-10 self-center">
         <Pressable className="bg-slate-900 px-8 py-4 rounded-full shadow-xl shadow-black/20">
            <Text className="text-white font-bold tracking-tight">Add New Task</Text>
         </Pressable>
      </View>
    </View>
  );
}