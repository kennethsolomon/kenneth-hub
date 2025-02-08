"use client";

import { createClient } from "@/lib/supabase/supabaseClient";
import { Delete, Edit, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeSnippetPage() {
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("javascript"); // Default language
  const [snippets, setSnippets] = useState<Snippet[]>([]); // Explicitly type the array

  // 🔹 Fetch snippets on load
  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error; // Proper error handling

    setSnippets(data as Snippet[]); // Assuming setSnippets is a React state setter
  };

  // 🔹 Save a new snippet
  const saveSnippet = async () => {
    const supabase = await createClient();
    if (!title || !code) return alert("Title and code are required!");

    const snippetData: {
      id?: string;
      title: string;
      code: string;
      language: string;
    } = { title, code, language };

    if (id) {
      snippetData.id = id;
    }
    const { data, error } = await supabase
      .from("snippets")
      .upsert([snippetData], { onConflict: "id" }); // Uses 'id' for conflict resolution

    if (error) {
      console.error("Error saving snippet:", error);
    } else {
      setTitle("");
      setCode("");
      setLanguage("javascript");
      setId(null);
      fetchSnippets(); // Refresh snippets after saving
    }
  };
  const handleEdit = async (snippet: Snippet) => {
    setLanguage(snippet.language);
    setCode(snippet.code);
    setTitle(snippet.title);
    setId(snippet.id);
    console.log("editing", snippet);
  };
  const handleDelete = async (id: string, title: string) => {
    const supabase = await createClient();
    const { error } = await supabase.from("snippets").delete().eq("id", id);

    if (error) throw new Error("Server Error.");

    fetchSnippets(); // Refresh snippets
    toast.success(
      `Snippet with title "${title}" has been successfully deleted. 🎊`
    );
    return true;
  };

  const handleSearch = async () => {
    if (!search) fetchSnippets();

    const supabase = await createClient();

    let { data: snippets, error } = await supabase
      .from("snippets")
      .select("*")
      .ilike("title", `%${search}%`)
      .order("created_at", { ascending: false });

    if (error) throw error; // Proper error handling

    setSnippets(snippets as Snippet[]); // Assuming setSnippets is a React state setter

    setSearch("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Code Snippet Manager</h1>

      {/* Input Fields */}
      <input
        type="text"
        placeholder="Enter snippet title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="php">PHP</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full p-2 border rounded h-40 font-mono"
      />
      <button
        onClick={saveSnippet}
        className="w-full bg-blue-500 text-white p-2 rounded mt-2"
      >
        Save Snippet
      </button>

      {/* Display Saved Snippets */}
      <div className="flex my-5 gap-2 ">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="snippet"
          placeholder="Search Snippet"
        />
        <Button onClick={handleSearch} type="button">
          Search
        </Button>
      </div>
      <h2 className="text-xl font-semibold">Saved Snippets</h2>
      {snippets.length === 0 ? (
        <p>No snippets yet.</p>
      ) : (
        <ul className="mt-2">
          {snippets.map((snippet) => (
            <li key={snippet?.id} className="p-2 bg-slate-700 rounded-md my-2 ">
              <div>
                <div className="flex justify-between px-2">
                  <h3 className="font-bold">{snippet?.title}</h3>
                  <div className="flex gap-3">
                    <Edit2
                      className="cursor-pointer"
                      width={17}
                      onClick={() => handleEdit(snippet)}
                    />
                    <Delete
                      className="cursor-pointer"
                      width={17}
                      onClick={() => handleDelete(snippet.id, snippet.title)}
                    />
                  </div>
                </div>
                <SyntaxHighlighter
                  language={snippet?.language || "javascript"} // Default to JS if undefined
                  style={vscDarkPlus}
                  wrapLongLines
                >
                  {snippet?.code}
                </SyntaxHighlighter>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
