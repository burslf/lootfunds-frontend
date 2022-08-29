import { useEffect, useState } from "react";
import { isDarkTheme, logoDarkPath, logoPath, logoLightPath, themeService } from "../../services/theme"
import './themeToggle.scss';

const ThemeToggle = () => {
    const [isDark, setIsDarkTheme] = useState(true);
    const [logo, setLogo] = useState('');

    useEffect(() => {
        isDarkTheme.subscribe(r => { setIsDarkTheme(r) })
        logoPath.subscribe(r => { setLogo(r) })
    }, []);

    const handleTheme = () => {
        setTimeout(() => {
            if (isDark) {
                themeService.setTheme('')
                logoPath.next(logoLightPath)
            } else {
                themeService.setTheme('dark')
                logoPath.next(logoDarkPath)
            }
        }, 400)
    }

    return (
        <div className="toggle-theme" onClick={() => handleTheme()}>
            <input className="checkbox" type="checkbox" id="toggle"/>
            <label htmlFor="toggle"></label>
        </div>
    )
}

export default ThemeToggle
