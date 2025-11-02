

interface AlertContentProps {
    content: [] | undefined;
}

export const AlertContent = (
    {
        content
    }: AlertContentProps) => {

    console.log(content);
    return <h1>{"테스트"}</h1>
}