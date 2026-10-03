const fs = require('fs');
const file = 'c:/jai-babaji-cab-admin-crm/jai-babaji-cab-admin-crm/src/components/fleet/FindCabs.js';
let content = fs.readFileSync(file, 'utf8');

const target = 'cab_type: cab?.cab_name?.toLowerCase() || cab?.cab_type || cab?.cab_type_id || "",';
const replacement = `cab_type: (() => {
      const t = String(cab?.cab_name?.toLowerCase() || cab?.cab_type || cab?.cab_type_id || "").toLowerCase();
      if (t === "0" || t === "1" || t === "mini") return "mini";
      if (t === "2" || t === "sedan") return "sedan";
      if (t === "3" || t === "suv") return "suv";
      return t;
    })(),`;

content = content.split(target).join(replacement);
fs.writeFileSync(file, content);
console.log('Frontend fixed');
