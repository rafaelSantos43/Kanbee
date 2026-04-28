import { DrizzleCardRepository } from "@/infrastructure/repositories/DrizzleCardRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const cardRepository = new DrizzleCardRepository();

export const useCardByList = (listId: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["cards", listId],
    queryFn: () => cardRepository.getCardsByListId(listId),
    enabled: !!listId,
  });

  return { cards: data, isLoading, refetch, error };
};

export const useCardById = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["cards", id],
    queryFn: () => cardRepository.getCardById(id),
    enabled: !!id,
  });

  return { card: data, isLoading, refetch, error };
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      card,
    }: {
      card: Parameters<typeof cardRepository.createCard>[0];
    }) => cardRepository.createCard(card),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.card.listId],
      });
    },
  });
};
