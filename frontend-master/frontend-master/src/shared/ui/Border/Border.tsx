export interface BorderProps {
    margin?: number;
    full?: boolean;
}

export const Border = (props: BorderProps) => {
    const {
        margin = '5px',
        full = false
    } = props;

    return (
        <div
            style={{
                width: full ? "100%" : "95%",
                height: "1px",
                margin: `${ margin } auto`,
                background: "var(--border-color)"
            }}
        />
    )
}