import * as privacy from '@/routes/app/privacy'
import { bindShortcutRoute } from '@/routes/bind-shortcut-route'

const shortcut = bindShortcutRoute(privacy)

export const generateMetadata = shortcut.generateMetadata
export default shortcut.default
