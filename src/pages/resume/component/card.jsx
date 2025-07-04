function renderCard(Card, item, column, disabled, cardList = []) {
    switch (item.typeCard) {
        case 'string':
            return <Card.StringCard item={item} column={column} page={0} disabled={disabled} cardList={cardList} />;
        case 'point':
            return <Card.PointCard item={item} column={column} page={0} disabled={disabled} cardList={cardList} />;
        case 'timeline':
            return <Card.TimelineCard item={item} column={column} page={0} disabled={disabled} cardList={cardList} />;
        case 'list':
            return <Card.ListCard item={item} column={column} page={0} disabled={disabled} cardList={cardList} />;
        case 'score':
            return <Card.ScoreCard item={item} column={column} page={0} disabled={disabled} cardList={cardList} />;
        case 'reference':
            return <Card.ReferenceCard item={item} column={column} page={0} disabled={disabled} cardList={cardList} />;
        default:
            return null;
    }
}

export default renderCard;
