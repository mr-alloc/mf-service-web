export default {
    getHtmlElement<T>(selector: string): Array<T> {
        const elements = document.querySelectorAll(selector)
        return Array.from(elements) as Array<T>
    }
}
