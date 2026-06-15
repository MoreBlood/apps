import * as roadmap from '@/routes/app/roadmap'
import { bindShortcutRoute } from '@/routes/bind-shortcut-route'

const shortcut = bindShortcutRoute(roadmap)

export const generateMetadata = shortcut.generateMetadata
export default shortcut.default
