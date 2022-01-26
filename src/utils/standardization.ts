export function canonicalEmail(email: string): string {
    email = email.replace(/^\s+|\s+$/g, "").replace(/\+[^@]+/, "") // Remove +pel in pierre+pel@gmail.com
    if (/@gmail.com$/.test(email)) {
        let domain = email.replace(/^.*@/, "")
        domain = domain.replace(/^googlemail%.com$/, "gmail.com")
        email = email
            .replace(/\./g, "")
            .replace(/^[^@]+/, (match) => match.toLowerCase())
            .replace(/@.*$/, `@${domain}`)
    }
    return email.toLowerCase()
}

export function validEmail(email: string): boolean {
    return /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(
        email
    )
}

export function validMobile(mobile: string): boolean {
    return (
        /^\(?\+?[-0-9. ()]+$/.test(trim(mobile)) &&
        trim(mobile).replace(/[^0-9]+/g, "").length >= 10
    )
}

export function canonicalMobile(mobile: string): string {
    if (!validMobile(mobile)) {
        return ""
    }
    let clean = trim(mobile).replace(/[-. ()+]/g, "")
    if (clean.length === 11) {
        clean = clean.replace(/^33/, "0")
    }
    if (clean.length < 10) {
        return ""
    }
    if (clean.length === 10) {
        return clean.replace(/([0-9]{2})/g, "$1 ").replace(/ $/, "")
    }
    return clean
}

export function trim(src: string): string {
    return typeof src !== "string" ? "" : src.replace(/^\s*/, "").replace(/\s*$/, "")
}

export function canonicalFirstname(firstname: string): string {
    return trim(firstname)
        .toLowerCase()
        .replace(/(?<=^|[\s'-])([a-zA-Z]|[à-ú]|[À-Ú])/gi, (s) => s.toUpperCase())
        .replace(/\b(de|d'|du|le|la)\b/gi, (s) => s.toLowerCase())
        .replace(/\b(d'|l')/gi, (s) => s.toLowerCase())
}

export function canonicalLastname(lastname: string): string {
    return trim(lastname)
        .toLowerCase()
        .replace(/(?<=^|[\s'-])([a-zA-Z]|[à-ú]|[À-Ú])/gi, (s) => s.toUpperCase())
        .replace(/\b(de|d'|du|le|la)\b/gi, (s) => s.toLowerCase())
        .replace(/\b(d'|l')/gi, (s) => s.toLowerCase())
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function doCleanVolunteer<
    Element extends { firstname: string; lastname: string; email: string; mobile: string }
>(vol: Element): void {
    if (!validMobile(vol.mobile)) {
        vol.mobile = ""
    } else {
        vol.mobile = canonicalMobile(vol.mobile)
    }

    vol.firstname = canonicalFirstname(vol.firstname)

    vol.lastname = canonicalLastname(vol.lastname)

    vol.email = canonicalEmail(vol.email)
}
