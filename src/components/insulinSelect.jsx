function  InsulinSelect({setInsulinDots}) {

    const handleClick = () => {
        setInsulinDots([
        { x: 1, y: 5 },
        { x: 2, y: 8 },
        { x: 3, y: 4 },
        { x: 4, y: 9 },
        ]);
    }

    return (
        <div>
            <button onClick={handleClick}>Инсулин 1</button>
            <span>Инсулин 2</span>
        </div>
    )
}

export default InsulinSelect