const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "src", "components");

fs.readdirSync(componentsDir).forEach((file) => {
  if (!file.endsWith(".tsx")) return;
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Remove import
  content = content.replace(/import GlitchText from "\.\/GlitchText";\n?/g, "");

  // Replace <GlitchText text="XYZ" className="foo" /> with <span className="foo">XYZ</span>
  content = content.replace(/<GlitchText\s+text="([^"]+)"\s+className="([^"]+)"\s*\/>/g, '<span className="$2">$1</span>');

  // Replace data-hover tags
  content = content.replace(/\sdata-hover(\s|>)/g, "$1");

  fs.writeFileSync(filePath, content);
});

// Remove CustomCursor from layout.tsx
const layoutPath = path.join(__dirname, "src", "app", "layout.tsx");
let layoutContent = fs.readFileSync(layoutPath, "utf-8");
layoutContent = layoutContent.replace(/import CustomCursor from "@\/components\/CustomCursor";\n?/g, "");
layoutContent = layoutContent.replace(/\s*<CustomCursor \/>\n?/g, "\n");
fs.writeFileSync(layoutPath, layoutContent);

console.log("Cleanup complete!");
