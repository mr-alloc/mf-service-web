export default {
    getHtmlElement<T>(selector: string): Array<T> {
        const elements = document.querySelectorAll(selector)
        return Array.from(elements) as Array<T>
    },
    getHtmlElementById<T>(id: string): T {
        return document.getElementById(id)! as T
    }
}
