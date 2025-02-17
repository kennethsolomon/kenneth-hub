import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteShortUrl, fetchUserShortUrls, shortenUrl } from "@/services/urlService";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

interface ShortenUrlResponse {
  shortUrl: string;
}

export function useShortenUrl() {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // ✅ Correct place to use useAuth()

  return useMutation<ShortenUrlResponse, Error, string>({
    mutationFn: (originalUrl) => shortenUrl(originalUrl, user.id), // ✅ Pass user.id as argument
    onSuccess: (data) => {
      toast.success("URL Shortened Successfully!");
      queryClient.setQueryData(["shortenedUrl"], data.shortUrl);
      queryClient.invalidateQueries({ queryKey: ["userShortUrls", user?.id] });
    },
    onError: () => {
      toast.error("Failed to shorten URL");
    },
  });
}

export function useUserShortUrls() {
  const { user } = useAuth();

  // Ensure `user` exists before accessing `user.id`
  return useQuery({
    queryKey: ["userShortUrls", user?.id], // Use optional chaining
    queryFn: () => fetchUserShortUrls(user!.id), // Assert non-null after check
    enabled: !!user?.id, // Only run query when user.id is available
  });
}

export function useDeleteShortUrl() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortUrlId: string) => deleteShortUrl(shortUrlId),
    onSuccess: () => {
      toast.success("URL deleted successfully!");

      queryClient.invalidateQueries({ queryKey: ["userShortUrls", user?.id] });
    },
    onError: () => {
      toast.error("Failed to delete shortened URL");
    },
  });
}