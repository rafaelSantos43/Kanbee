import { KTextInput } from "@/components/KTextInput";
import { Search } from "lucide-react-native";
import { View } from "react-native";

type SearchBoardProps = {
  searchText: string;
  onSearch: (text: string) => void;
};

export const SearchBoard = ({ searchText, onSearch }: SearchBoardProps) => {
  // const { searchQuery, setSearchQuery } = useBoardStore()
  return (
    <View>
      <KTextInput
        placeholder="Search board"
        leftIcon={<Search size={20} color="#64748b" />}
        onChangeText={onSearch}
        value={searchText}
      />
    </View>
  );
};
