import { BehaviorSubject } from "rxjs";

const logoDarkPath = "../../../../assets/images/logo.png"
const logoLightPath = "../../../../assets/images/logo-light.png"

const isDarkTheme = new BehaviorSubject(true)
const logoPath = new BehaviorSubject(logoDarkPath)

const themeService = {
    setTheme : function(theme) {
        document.documentElement.setAttribute("theme", theme);
        isDarkTheme.next(theme)
    },
    setLogoPath: function(path) {
        logoPath.next(path)
    }
}

export {
    isDarkTheme, 
    themeService,
    logoPath,
    logoLightPath,
    logoDarkPath
}