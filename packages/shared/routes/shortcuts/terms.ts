import * as terms from '@/routes/app/terms'
import { bindShortcutRoute } from '@/routes/bind-shortcut-route'

const shortcut = bindShortcutRoute(terms)

export const generateMetadata = shortcut.generateMetadata
export default shortcut.default
