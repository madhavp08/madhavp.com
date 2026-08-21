import { Button, Input, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { FormEvent, useState } from "react";

const KINDS = [
  { value: "movies", label: "Movie" },
  { value: "music", label: "Song" },
  { value: "books", label: "Book" },
  { value: "shows", label: "Show" },
] as const;

const field = {
  bg: "transparent",
  borderColor: "gray.700",
  color: "gray.200",
  _placeholder: { color: "gray.600" },
  _hover: { borderColor: "gray.600" },
  _focus: { borderColor: "gray.500", boxShadow: "none" },
};

export function RecommendForm() {
  const [kind, setKind] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          message,
          company: honeypot,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Could not send");
        return;
      }
      setStatus("sent");
      setKind("");
      setTitle("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Could not send");
    }
  }

  return (
    <Stack as="form" spacing={3} w="100%" onSubmit={onSubmit}>
      <Text fontWeight="bold" fontSize="sm" color="gray.400">
        Media recommendation
      </Text>
      <Input
        display="none"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
      />
      <Select
        placeholder="Media"
        value={kind}
        onChange={(event) => setKind(event.target.value)}
        isRequired
        size="sm"
        sx={{ option: { bg: "#1a1a1a" } }}
        {...field}
      >
        {KINDS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        isRequired
        maxLength={200}
        size="sm"
        {...field}
      />
      <Textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        size="sm"
        rows={4}
        resize="none"
        {...field}
      />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        borderColor="gray.700"
        color="gray.300"
        fontWeight="normal"
        isLoading={status === "sending"}
        _hover={{ bg: "whiteAlpha.100", borderColor: "gray.500" }}
      >
        Send
      </Button>
      {status === "sent" && (
        <Text fontSize="sm" color="gray.500">
          Sent.
        </Text>
      )}
      {status === "error" && (
        <Text fontSize="sm" color="red.300">
          {error}
        </Text>
      )}
    </Stack>
  );
}
