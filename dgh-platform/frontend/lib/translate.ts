import axios from "axios"

export async function translate(text: string, target: string): Promise<string> {
    try {
        const res = await axios.post("https://libretranslate.de/translate", {
            q: text,
            source: "auto",
            target: target,
            format: "text"
        }, {
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            }
        })

        return res.data.translatedText
    } catch (error) {
        console.error("Translation error:", error)
        return ""
    }
}
