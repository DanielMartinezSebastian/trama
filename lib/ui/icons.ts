/**
 * Registro curado de iconos pixel art: 119 de los ~640 de Pixelarticons (MIT, © Gerrit Halfmann —
 * npm `pixelarticons`, pixelarticons.com), dibujados sobre una rejilla de 24×24. Lo consume `components/ui/Icon.tsx`.
 *
 * Por qué curado y con imports profundos (`pixelarticons/react/Heart`, no el barrel `pixelarticons/react`): el
 * paquete no declara `sideEffects: false`, así que importar por el barrel puede meter los 1037 componentes en el
 * bundle de cualquier página que use un solo icono. Cada icono aquí es su propio módulo de ~0,5 KB.
 *
 * Para un icono que no esté en el registro no hace falta tocarlo: `<Icon icon={Zap} />` acepta cualquier componente
 * de `pixelarticons/react/*` (incluidas las variantes `…Solid` y `…Glyph`). Para añadirlo al registro (y al selector
 * del catálogo): un `import` arriba, una línea en `ICONS` y su clave en `ICON_GROUPS`. Claves = kebab-case del nombre
 * del componente. `sharp` = variante de esquinas duras, que Pixelarticons solo dibuja para ~1 de cada 2 iconos.
 */
import type { ReactElement, SVGProps } from "react";
import { Alien } from "pixelarticons/react/Alien";
import { ArrowDown } from "pixelarticons/react/ArrowDown";
import { ArrowLeft } from "pixelarticons/react/ArrowLeft";
import { ArrowRight } from "pixelarticons/react/ArrowRight";
import { ArrowUp } from "pixelarticons/react/ArrowUp";
import { AtSign } from "pixelarticons/react/AtSign";
import { AtSignSharp } from "pixelarticons/react/AtSignSharp";
import { BatteryFull } from "pixelarticons/react/BatteryFull";
import { BatteryFullSharp } from "pixelarticons/react/BatteryFullSharp";
import { Bell } from "pixelarticons/react/Bell";
import { BellSharp } from "pixelarticons/react/BellSharp";
import { Bluesky } from "pixelarticons/react/Bluesky";
import { Bomb } from "pixelarticons/react/Bomb";
import { Bookmark } from "pixelarticons/react/Bookmark";
import { BookmarkSharp } from "pixelarticons/react/BookmarkSharp";
import { Bug } from "pixelarticons/react/Bug";
import { BugSharp } from "pixelarticons/react/BugSharp";
import { Calendar } from "pixelarticons/react/Calendar";
import { CalendarSharp } from "pixelarticons/react/CalendarSharp";
import { Camera } from "pixelarticons/react/Camera";
import { CameraSharp } from "pixelarticons/react/CameraSharp";
import { Castle } from "pixelarticons/react/Castle";
import { CastleSharp } from "pixelarticons/react/CastleSharp";
import { Check } from "pixelarticons/react/Check";
import { Chess } from "pixelarticons/react/Chess";
import { ChessSharp } from "pixelarticons/react/ChessSharp";
import { ChevronDown } from "pixelarticons/react/ChevronDown";
import { ChevronLeft } from "pixelarticons/react/ChevronLeft";
import { ChevronRight } from "pixelarticons/react/ChevronRight";
import { ChevronUp } from "pixelarticons/react/ChevronUp";
import { CircleInfo } from "pixelarticons/react/CircleInfo";
import { CircleQuestion } from "pixelarticons/react/CircleQuestion";
import { Clock } from "pixelarticons/react/Clock";
import { Close } from "pixelarticons/react/Close";
import { Cloud } from "pixelarticons/react/Cloud";
import { Code } from "pixelarticons/react/Code";
import { Coffee } from "pixelarticons/react/Coffee";
import { CoffeeSharp } from "pixelarticons/react/CoffeeSharp";
import { Coins } from "pixelarticons/react/Coins";
import { Compass } from "pixelarticons/react/Compass";
import { Copy } from "pixelarticons/react/Copy";
import { CopySharp } from "pixelarticons/react/CopySharp";
import { Cpu } from "pixelarticons/react/Cpu";
import { CpuSharp } from "pixelarticons/react/CpuSharp";
import { Crown } from "pixelarticons/react/Crown";
import { CrownSharp } from "pixelarticons/react/CrownSharp";
import { Database } from "pixelarticons/react/Database";
import { Discord } from "pixelarticons/react/Discord";
import { Download } from "pixelarticons/react/Download";
import { DownloadSharp } from "pixelarticons/react/DownloadSharp";
import { ExternalLink } from "pixelarticons/react/ExternalLink";
import { ExternalLinkSharp } from "pixelarticons/react/ExternalLinkSharp";
import { Eye } from "pixelarticons/react/Eye";
import { EyeOff } from "pixelarticons/react/EyeOff";
import { Feather } from "pixelarticons/react/Feather";
import { File } from "pixelarticons/react/File";
import { FileSharp } from "pixelarticons/react/FileSharp";
import { FileText } from "pixelarticons/react/FileText";
import { FileTextSharp } from "pixelarticons/react/FileTextSharp";
import { Filter } from "pixelarticons/react/Filter";
import { Fire } from "pixelarticons/react/Fire";
import { Flag } from "pixelarticons/react/Flag";
import { Folder } from "pixelarticons/react/Folder";
import { FolderSharp } from "pixelarticons/react/FolderSharp";
import { Gamepad } from "pixelarticons/react/Gamepad";
import { GamepadSharp } from "pixelarticons/react/GamepadSharp";
import { Gift } from "pixelarticons/react/Gift";
import { GiftSharp } from "pixelarticons/react/GiftSharp";
import { GitBranch } from "pixelarticons/react/GitBranch";
import { GitBranchSharp } from "pixelarticons/react/GitBranchSharp";
import { Github } from "pixelarticons/react/Github";
import { Globe } from "pixelarticons/react/Globe";
import { Headphone } from "pixelarticons/react/Headphone";
import { Heart } from "pixelarticons/react/Heart";
import { Home } from "pixelarticons/react/Home";
import { HomeSharp } from "pixelarticons/react/HomeSharp";
import { Hourglass } from "pixelarticons/react/Hourglass";
import { HourglassSharp } from "pixelarticons/react/HourglassSharp";
import { Image } from "pixelarticons/react/Image";
import { ImageSharp } from "pixelarticons/react/ImageSharp";
import { Instagram } from "pixelarticons/react/Instagram";
import { Joystick } from "pixelarticons/react/Joystick";
import { JoystickSharp } from "pixelarticons/react/JoystickSharp";
import { Key } from "pixelarticons/react/Key";
import { Leaf } from "pixelarticons/react/Leaf";
import { Lightbulb } from "pixelarticons/react/Lightbulb";
import { Link } from "pixelarticons/react/Link";
import { LinkSharp } from "pixelarticons/react/LinkSharp";
import { Linkedin } from "pixelarticons/react/Linkedin";
import { Lock } from "pixelarticons/react/Lock";
import { LockSharp } from "pixelarticons/react/LockSharp";
import { Login } from "pixelarticons/react/Login";
import { LoginSharp } from "pixelarticons/react/LoginSharp";
import { Logout } from "pixelarticons/react/Logout";
import { LogoutSharp } from "pixelarticons/react/LogoutSharp";
import { Mail } from "pixelarticons/react/Mail";
import { MailSharp } from "pixelarticons/react/MailSharp";
import { MapPin } from "pixelarticons/react/MapPin";
import { Mastodon } from "pixelarticons/react/Mastodon";
import { Menu } from "pixelarticons/react/Menu";
import { Message } from "pixelarticons/react/Message";
import { MessageSharp } from "pixelarticons/react/MessageSharp";
import { Mic } from "pixelarticons/react/Mic";
import { MicSharp } from "pixelarticons/react/MicSharp";
import { Minus } from "pixelarticons/react/Minus";
import { Moon } from "pixelarticons/react/Moon";
import { MoreHorizontal } from "pixelarticons/react/MoreHorizontal";
import { MoreHorizontalSharp } from "pixelarticons/react/MoreHorizontalSharp";
import { MoreVertical } from "pixelarticons/react/MoreVertical";
import { MoreVerticalSharp } from "pixelarticons/react/MoreVerticalSharp";
import { Music } from "pixelarticons/react/Music";
import { MusicSharp } from "pixelarticons/react/MusicSharp";
import { Npm } from "pixelarticons/react/Npm";
import { Pause } from "pixelarticons/react/Pause";
import { Pencil } from "pixelarticons/react/Pencil";
import { Phone } from "pixelarticons/react/Phone";
import { PhoneSharp } from "pixelarticons/react/PhoneSharp";
import { Play } from "pixelarticons/react/Play";
import { Plus } from "pixelarticons/react/Plus";
import { Potion } from "pixelarticons/react/Potion";
import { PotionSharp } from "pixelarticons/react/PotionSharp";
import { Power } from "pixelarticons/react/Power";
import { React } from "pixelarticons/react/React";
import { Reload } from "pixelarticons/react/Reload";
import { ReloadSharp } from "pixelarticons/react/ReloadSharp";
import { Robot } from "pixelarticons/react/Robot";
import { RobotSharp } from "pixelarticons/react/RobotSharp";
import { Save } from "pixelarticons/react/Save";
import { SaveSharp } from "pixelarticons/react/SaveSharp";
import { Search } from "pixelarticons/react/Search";
import { Send } from "pixelarticons/react/Send";
import { Server } from "pixelarticons/react/Server";
import { ServerSharp } from "pixelarticons/react/ServerSharp";
import { SettingsCog } from "pixelarticons/react/SettingsCog";
import { Share } from "pixelarticons/react/Share";
import { ShareSharp } from "pixelarticons/react/ShareSharp";
import { Shield } from "pixelarticons/react/Shield";
import { ShieldSharp } from "pixelarticons/react/ShieldSharp";
import { ShoppingCart } from "pixelarticons/react/ShoppingCart";
import { Skull } from "pixelarticons/react/Skull";
import { SkullSharp } from "pixelarticons/react/SkullSharp";
import { Snowflake } from "pixelarticons/react/Snowflake";
import { Sparkles } from "pixelarticons/react/Sparkles";
import { Star } from "pixelarticons/react/Star";
import { Sun } from "pixelarticons/react/Sun";
import { Sword } from "pixelarticons/react/Sword";
import { Target } from "pixelarticons/react/Target";
import { Terminal } from "pixelarticons/react/Terminal";
import { TerminalSharp } from "pixelarticons/react/TerminalSharp";
import { Trash } from "pixelarticons/react/Trash";
import { TrashSharp } from "pixelarticons/react/TrashSharp";
import { Tree } from "pixelarticons/react/Tree";
import { Trophy } from "pixelarticons/react/Trophy";
import { TrophySharp } from "pixelarticons/react/TrophySharp";
import { Unlock } from "pixelarticons/react/Unlock";
import { UnlockSharp } from "pixelarticons/react/UnlockSharp";
import { Upload } from "pixelarticons/react/Upload";
import { UploadSharp } from "pixelarticons/react/UploadSharp";
import { User } from "pixelarticons/react/User";
import { UserSharp } from "pixelarticons/react/UserSharp";
import { Users } from "pixelarticons/react/Users";
import { UsersSharp } from "pixelarticons/react/UsersSharp";
import { Vercel } from "pixelarticons/react/Vercel";
import { Video } from "pixelarticons/react/Video";
import { VideoSharp } from "pixelarticons/react/VideoSharp";
import { Volume } from "pixelarticons/react/Volume";
import { Wand } from "pixelarticons/react/Wand";
import { WarningDiamond } from "pixelarticons/react/WarningDiamond";
import { Wifi } from "pixelarticons/react/Wifi";
import { Youtube } from "pixelarticons/react/Youtube";
import { Zap } from "pixelarticons/react/Zap";

export type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;
export type IconEntry = { base: IconComponent; sharp?: IconComponent };

export const ICONS = {
  // Acciones
  plus: { base: Plus },
  minus: { base: Minus },
  close: { base: Close },
  check: { base: Check },
  pencil: { base: Pencil },
  trash: { base: Trash, sharp: TrashSharp },
  copy: { base: Copy, sharp: CopySharp },
  save: { base: Save, sharp: SaveSharp },
  download: { base: Download, sharp: DownloadSharp },
  upload: { base: Upload, sharp: UploadSharp },
  reload: { base: Reload, sharp: ReloadSharp },
  search: { base: Search },
  filter: { base: Filter },
  link: { base: Link, sharp: LinkSharp },
  share: { base: Share, sharp: ShareSharp },
  send: { base: Send },
  // Navegación
  "arrow-left": { base: ArrowLeft },
  "arrow-right": { base: ArrowRight },
  "arrow-up": { base: ArrowUp },
  "arrow-down": { base: ArrowDown },
  "chevron-left": { base: ChevronLeft },
  "chevron-right": { base: ChevronRight },
  "chevron-up": { base: ChevronUp },
  "chevron-down": { base: ChevronDown },
  menu: { base: Menu },
  home: { base: Home, sharp: HomeSharp },
  "external-link": { base: ExternalLink, sharp: ExternalLinkSharp },
  "more-horizontal": { base: MoreHorizontal, sharp: MoreHorizontalSharp },
  "more-vertical": { base: MoreVertical, sharp: MoreVerticalSharp },
  login: { base: Login, sharp: LoginSharp },
  logout: { base: Logout, sharp: LogoutSharp },
  // Estado
  "circle-info": { base: CircleInfo },
  "warning-diamond": { base: WarningDiamond },
  "circle-question": { base: CircleQuestion },
  bell: { base: Bell, sharp: BellSharp },
  heart: { base: Heart },
  star: { base: Star },
  bookmark: { base: Bookmark, sharp: BookmarkSharp },
  flag: { base: Flag },
  lock: { base: Lock, sharp: LockSharp },
  unlock: { base: Unlock, sharp: UnlockSharp },
  eye: { base: Eye },
  "eye-off": { base: EyeOff },
  shield: { base: Shield, sharp: ShieldSharp },
  // Personas
  user: { base: User, sharp: UserSharp },
  users: { base: Users, sharp: UsersSharp },
  mail: { base: Mail, sharp: MailSharp },
  message: { base: Message, sharp: MessageSharp },
  phone: { base: Phone, sharp: PhoneSharp },
  "at-sign": { base: AtSign, sharp: AtSignSharp },
  // Tecnología
  terminal: { base: Terminal, sharp: TerminalSharp },
  code: { base: Code },
  cpu: { base: Cpu, sharp: CpuSharp },
  database: { base: Database },
  server: { base: Server, sharp: ServerSharp },
  cloud: { base: Cloud },
  wifi: { base: Wifi },
  "battery-full": { base: BatteryFull, sharp: BatteryFullSharp },
  zap: { base: Zap },
  power: { base: Power },
  "settings-cog": { base: SettingsCog },
  bug: { base: Bug, sharp: BugSharp },
  "git-branch": { base: GitBranch, sharp: GitBranchSharp },
  globe: { base: Globe },
  // Marcas
  github: { base: Github },
  discord: { base: Discord },
  linkedin: { base: Linkedin },
  instagram: { base: Instagram },
  youtube: { base: Youtube },
  mastodon: { base: Mastodon },
  bluesky: { base: Bluesky },
  react: { base: React },
  npm: { base: Npm },
  vercel: { base: Vercel },
  // Medios
  file: { base: File, sharp: FileSharp },
  "file-text": { base: FileText, sharp: FileTextSharp },
  folder: { base: Folder, sharp: FolderSharp },
  image: { base: Image, sharp: ImageSharp },
  camera: { base: Camera, sharp: CameraSharp },
  video: { base: Video, sharp: VideoSharp },
  music: { base: Music, sharp: MusicSharp },
  play: { base: Play },
  pause: { base: Pause },
  volume: { base: Volume },
  mic: { base: Mic, sharp: MicSharp },
  headphone: { base: Headphone },
  // Juego
  gamepad: { base: Gamepad, sharp: GamepadSharp },
  joystick: { base: Joystick, sharp: JoystickSharp },
  sword: { base: Sword },
  skull: { base: Skull, sharp: SkullSharp },
  bomb: { base: Bomb },
  trophy: { base: Trophy, sharp: TrophySharp },
  crown: { base: Crown, sharp: CrownSharp },
  coins: { base: Coins },
  potion: { base: Potion, sharp: PotionSharp },
  robot: { base: Robot, sharp: RobotSharp },
  alien: { base: Alien },
  castle: { base: Castle, sharp: CastleSharp },
  chess: { base: Chess, sharp: ChessSharp },
  fire: { base: Fire },
  sparkles: { base: Sparkles },
  leaf: { base: Leaf },
  tree: { base: Tree },
  sun: { base: Sun },
  moon: { base: Moon },
  snowflake: { base: Snowflake },
  // Objetos
  calendar: { base: Calendar, sharp: CalendarSharp },
  clock: { base: Clock },
  "map-pin": { base: MapPin },
  "shopping-cart": { base: ShoppingCart },
  gift: { base: Gift, sharp: GiftSharp },
  key: { base: Key },
  lightbulb: { base: Lightbulb },
  coffee: { base: Coffee, sharp: CoffeeSharp },
  compass: { base: Compass },
  target: { base: Target },
  hourglass: { base: Hourglass, sharp: HourglassSharp },
  feather: { base: Feather },
  wand: { base: Wand },
} satisfies Record<string, IconEntry>;

export type IconName = keyof typeof ICONS;

/** Agrupación para el selector del catálogo y para documentar el set. */
export const ICON_GROUPS: { label: string; names: IconName[] }[] = [
  { label: "Acciones", names: ["plus", "minus", "close", "check", "pencil", "trash", "copy", "save", "download", "upload", "reload", "search", "filter", "link", "share", "send"] },
  { label: "Navegación", names: ["arrow-left", "arrow-right", "arrow-up", "arrow-down", "chevron-left", "chevron-right", "chevron-up", "chevron-down", "menu", "home", "external-link", "more-horizontal", "more-vertical", "login", "logout"] },
  { label: "Estado", names: ["circle-info", "warning-diamond", "circle-question", "bell", "heart", "star", "bookmark", "flag", "lock", "unlock", "eye", "eye-off", "shield"] },
  { label: "Personas", names: ["user", "users", "mail", "message", "phone", "at-sign"] },
  { label: "Tecnología", names: ["terminal", "code", "cpu", "database", "server", "cloud", "wifi", "battery-full", "zap", "power", "settings-cog", "bug", "git-branch", "globe"] },
  { label: "Marcas", names: ["github", "discord", "linkedin", "instagram", "youtube", "mastodon", "bluesky", "react", "npm", "vercel"] },
  { label: "Medios", names: ["file", "file-text", "folder", "image", "camera", "video", "music", "play", "pause", "volume", "mic", "headphone"] },
  { label: "Juego", names: ["gamepad", "joystick", "sword", "skull", "bomb", "trophy", "crown", "coins", "potion", "robot", "alien", "castle", "chess", "fire", "sparkles", "leaf", "tree", "sun", "moon", "snowflake"] },
  { label: "Objetos", names: ["calendar", "clock", "map-pin", "shopping-cart", "gift", "key", "lightbulb", "coffee", "compass", "target", "hourglass", "feather", "wand"] },
];

export const ICON_NAMES = Object.keys(ICONS) as IconName[];
