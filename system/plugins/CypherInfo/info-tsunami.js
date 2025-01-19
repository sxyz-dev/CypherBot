const cheerio = require('cheerio');

/**
 * Main handler function for processing tsunami data
 * @param {Object} m - Message object
 * @param {Object} sock - Connection object
 */
let handler = async (m, { sock }) => {
    try {
        const data = await get30LatestTsunami();
        let response = "🌊 *30 KEJADIAN TSUNAMI TERAKHIR* 🌊\n";
        
        data.forEach((tsunami, index) => {
            response += formatTsunamiMessage(tsunami, index + 1);
        });
        
        response += "\n📝 *Sumber: BMKG Indonesia*";
        
        // Send the formatted message
        await m.reply(response);
    } catch (error) {
        console.error("Error in tsunami handler:", error);
       return m.reply("❌ Terjadi kesalahan saat mengambil data tsunami.");
    }
};
handler.command = "tsunami";
handler.alias = ["tsnm"];
handler.category = ["info"];
handler.settings = {
   limit: true
},

handler.loading = true

module.exports = handler;
/**
 * Fetches the 30 latest tsunami events from BMKG
 * @returns {Promise<Array>} Array of tsunami events
 */
async function get30LatestTsunami() {
    const XMLURL = "https://bmkg-content-inatews.storage.googleapis.com/last30tsunamievent.xml";
    
    try {
        const response = await fetch(XMLURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        
        const $ = cheerio.load(data, { xmlMode: true });
        
        const tsunamis = [];
        $("info").each((index, element) => {
            const tsunami = {
                event: $(element).find("event").text().trim(),
                date: formatDate($(element).find("date").text().trim()),
                time: formatTime($(element).find("time").first().text().trim()),
                magnitude: $(element).find("magnitude").text().trim(),
                area: $(element).find("area").text().trim(),
                potential: $(element).find("potential").text().trim(),
                headline: $(element).find("headline").text().trim(),
                description: $(element).find("description").text().trim()
            };
            
            // Only add valid entries
            if (tsunami.event && tsunami.date && tsunami.time) {
                tsunamis.push(tsunami);
            }
        });
        
        return tsunamis;
    } catch (error) {
        console.error("Error fetching tsunami data:", error);
        throw error;
    }
}

/**
 * Formats the date from DD-MM-YY to DD/MM/YYYY
 * @param {string} date - Date string in DD-MM-YY format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    if (!date) return "";
    
    const [day, month, year] = date.split("-");
    if (!day || !month || !year) return date;
    
    const fullYear = parseInt(year) < 2000 ? `20${year}` : year;
    return `${day}/${month}/${fullYear}`;
}

/**
 * Formats the time by removing the WIB suffix
 * @param {string} time - Time string with WIB suffix
 * @returns {string} Formatted time
 */
function formatTime(time) {
    if (!time) return "";
    return time.replace(" WIB", "");
}

/**
 * Formats a single tsunami event into a readable message
 * @param {Object} tsunami - Tsunami event object
 * @param {number} index - Index of the tsunami event
 * @returns {string} Formatted message
 */
function formatTsunamiMessage(tsunami, index) {
    return `
${index}. 📍 *${tsunami.event}*
📅 Tanggal: ${tsunami.date}
⏰ Waktu: ${tsunami.time} WIB
📊 Magnitudo: ${tsunami.magnitude}
🌍 Area: ${tsunami.area}
⚠️ Potensi: ${tsunami.potential}

${tsunami.description}
${'-'.repeat(40)}
`;
}