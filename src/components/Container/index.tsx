interface containerProps  {
    children : React.ReactNode,
    className? : string
}

function Container({ children, className } : containerProps) {

    return (
        <section className={`${className}`}>
            {children}
        </section>
    );

}

export default Container;
