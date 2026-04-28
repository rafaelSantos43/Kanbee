// hooks/useBoard.ts
import { SQLiteBoardRepository } from "@/infrastructure/repositories/SQLiteBoardRepository";
import { useSessionStore } from "@/store/useSessionStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const boardRepo = new SQLiteBoardRepository();

export function useBoards() {
  const user = useSessionStore((state) => state.user);
  const hydrated = useSessionStore((state) => state.hydrated);

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["boards", user?.id],
    queryFn: () => boardRepo.getBoards(user!.id),
    enabled: hydrated && !!user?.id,
  });

  return { boards: data, isLoading, error, refetch };
}

export function useBoardById(id: string) {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["boards", id],
    queryFn: () => boardRepo.getBoardById(id),
    enabled: !!id,
  });

  return { board: data, isLoading, error, refetch };
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (board: Parameters<typeof boardRepo.createBoard>[0]) =>
      boardRepo.createBoard(board),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof boardRepo.updateBoard>[1];
    }) => boardRepo.updateBoard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardRepo.deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
