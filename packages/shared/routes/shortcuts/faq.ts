import * as faq from '@/routes/app/faq'
import { bindShortcutRoute } from '@/routes/bind-shortcut-route'

const shortcut = bindShortcutRoute(faq)

export const generateMetadata = shortcut.generateMetadata
export default shortcut.default
