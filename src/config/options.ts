export type Voice = { value: string; label: string }
export type Language = { value: string; label: string; voices: Voice[] }
export type Option = { value: string; label: string }

export const languages: Language[] = [
  { value: "en", label: "🇺🇸 English", voices: [
    { value: "en-US-BrianNeural", label: "Brian" },
    { value: "en-US-AvaNeural", label: "Ava" },
    { value: "en-US-AndrewNeural", label: "Matthew" },
    { value: "en-US-EmmaNeural", label: "Emma" },
    { value: "en-US-JennyNeural", label: "Jenny" },
  ] },
  { value: "es", label: "🇪🇸 Spanish", voices: [
    { value: "es-BO-SofiaNeural", label: "Sofia" },
    { value: "es-BO-MarceloNeural", label: "Marcelo" },
    { value: "es-MX-JorgeNeural", label: "Jorge" },
    { value: "es-MX-DaliaNeural", label: "Dalia" },
    { value: "es-DO-EmilioNeural", label: "Emilio" },
  ] },
]

export const backgrounds: Option[] = [
  { value: "subways", label: "Subway Surfers" },
  { value: "gtav", label: "GTA V" },
  { value: "minecraft", label: "Minecraft" },
  { value: "roblox", label: "Roblox" },
  { value: "satisfying", label: "Satisfying" },
]

export const musics: Option[] = [
  { value: "elevator", label: "Elevator" },
  { value: "nocturne", label: "Nocturne" },
  { value: "else", label: "Else" },
  { value: "hiddenagenda", label: "Hidden Agenda" },
  { value: "sneakysnitch", label: "Sneaky Snitch" },
  { value: "tiptoes", label: "Tip Toes" },
  { value: "wiener", label: "Wiener Klange Im Walzertakt" },
  { value: "waltz", label: "Waltz of Flowers" },
]

export const musicOptions: Option[] = [{ value: "", label: "No music" }, ...musics]

export function getVoiceLabel(value: string): string {
  for (const lang of languages) {
    const v = lang.voices.find((x) => x.value === value)
    if (v) return v.label
  }
  return value
}

export function getMusicLabel(value: string | null | undefined): string {
  if (!value) return "(none)"
  return musics.find((m) => m.value === value)?.label ?? value
}

export function getBackgroundLabel(value: string | null | undefined): string {
  if (!value) return value ?? ""
  return backgrounds.find((b) => b.value === value)?.label ?? value
}
