"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TocItem {
  level: number;
  text: string;
  id: string;
}

function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*/g, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      toc.push({ level, text, id });
    }
  });

  return toc;
}

const TocItem = ({
  item,
  onClick,
}: {
  item: TocItem;
  onClick: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Button
      variant="ghost"
      className={`w-full justify-start text-left transition-all duration-200 ${
        item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""
      }`}
      onClick={() => onClick(item.id)}
    >
      {item.level > 1 && (
        <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />
      )}
      <span
        className={`${
          item.level === 1 ? "font-semibold" : ""
        } break-words whitespace-normal line-clamp-2`}
      >
        {item.text}
      </span>
    </Button>
  </motion.div>
);

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setToc(extractToc(content));
  }, [content]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="toc-nav relative">
      <Button
        variant="outline"
        className="mb-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="mr-2 h-4 w-4" />
        Table of Contents
      </Button>
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:bg-transparent lg:backdrop-blur-none"
          >
            <h2 className="text-lg font-semibold mb-4 px-4 pt-4 lg:px-0 lg:pt-0">
              Table of Contents
            </h2>
            <ScrollArea className="h-[calc(100vh-8rem)] px-4 lg:px-0">
              <div className="space-y-1">
                {toc.map((item, index) => (
                  <TocItem key={index} item={item} onClick={handleClick} />
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
