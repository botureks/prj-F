// @ts-nocheck

interface UploadedImageData {
    file?: {
        url?: string;
    };
}

interface UploadedImageToolConfig {
    upload: (file: File) => Promise<string>;
}

export class UploadedImageTool {
    private data: UploadedImageData;
    private config: UploadedImageToolConfig;
    private wrapper: HTMLDivElement | null = null;

    static get toolbox() {
        return {
            title: "Изображение",
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v14H4V5Zm2 2v8.5l3.5-3.5 2.5 2.5 2.5-2.5L18 15.5V7H6Zm3 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor"/></svg>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, config }: { data: UploadedImageData; config: UploadedImageToolConfig }) {
        this.data = data ?? {};
        this.config = config;
    }

    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.style.width = "100%";

        const url = this.data?.file?.url;

        if (url) {
            this.renderImage(url);
        } else {
            this.renderPicker();
        }

        return this.wrapper;
    }

    private renderPicker() {
        if (!this.wrapper) {
            return;
        }

        const input = document.createElement("input");
        input.type = "file";
        input.hidden = true;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Выбрать изображение";
        button.style.padding = "10px 14px";
        button.style.cursor = "pointer";

        button.addEventListener("click", () => input.click());

        input.addEventListener("change", async () => {
            const file = input.files?.[0];

            if (!file) {
                return;
            }

            button.disabled = true;
            button.textContent = "Загрузка...";

            try {
                const url = await this.config.upload(file);
                this.data = { file: { url } };
                this.wrapper!.innerHTML = "";
                this.renderImage(url);
            } catch {
                button.disabled = false;
                button.textContent = "Ошибка загрузки. Выбрать снова";
            }
        });

        this.wrapper.append(button, input);
    }

    private renderImage(url: string) {
        if (!this.wrapper) {
            return;
        }

        const image = document.createElement("img");
        image.src = url;
        image.alt = "Изображение поста";
        image.style.display = "block";
        image.style.maxWidth = "100%";
        image.style.height = "auto";
        image.style.margin = "8px 0";

        this.wrapper.appendChild(image);
    }

    save() {
        return this.data;
    }

    validate(savedData: UploadedImageData) {
        return Boolean(savedData?.file?.url);
    }
}