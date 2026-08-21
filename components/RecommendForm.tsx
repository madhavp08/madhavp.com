import { Button, Input, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { RECOMMEND_EMAIL, WEB3FORMS_ACCESS_KEY } from "../lib/site";

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
      if (honeypot.trim()) {
        setStatus("sent");
        return;
      }
      const label = KINDS.find((item) => item.value === kind)?.label || kind;
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Recommendation: ${label} — ${title}`,
          from_name: "madhavp.com",
          email: RECOMMEND_EMAIL,
          ccemail: RECOMMEND_EMAIL,
          Media: label,
          Title: title,
          Message: message.trim() || "(none)",
        }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Could not send");
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
    <Stack as="form" spacing={4} w="100%" onSubmit={onSubmit}>
      <Text fontWeight="bold" fontSize="md" color="gray.300">
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
        size="md"
        h="44px"
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
        size="md"
        h="44px"
        {...field}
      />
      <Textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        size="md"
        rows={6}
        minH="160px"
        resize="none"
        {...field}
      />
      <Button
        type="submit"
        size="md"
        h="44px"
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
