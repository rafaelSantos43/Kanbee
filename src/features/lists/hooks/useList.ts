import { DrizzleListRepository } from "@/infrastructure/repositories/DrizzleListRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const listRepository = new DrizzleListRepository();

export const useListsByBoard = (boardId: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => listRepository.getListsByBoardId(boardId),
    enabled: !!boardId,
  });
  return { lists: data, isLoading, refetch, error };
};

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      boardId,
      orderIndex,
      isArchived,
    }: Parameters<typeof listRepository.createList>[0]) =>
      listRepository.createList({
        title,
        boardId,
        orderIndex,
        isArchived,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lists", variables.boardId] });
    },
  });
};

type UpdateListParams = {
  id: Parameters<typeof listRepository.updateList>[0];
  data: Parameters<typeof listRepository.updateList>[1];
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateListParams) =>
      listRepository.updateList(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lists", variables.id] });
    },
  });
};

export const useDeleteLIst = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: Parameters<typeof listRepository.deleteList>[0];
    }) => listRepository.deleteList(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lists", variables.id] });
    },
  });
};
