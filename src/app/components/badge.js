const Badge = ({ type }) => {
    return (
      <>
        {type==="buy"? (
          <div className="stock-data recommendation buy">Buy</div>
        ) : (
          <div className="stock-data recommendation sell">Sell</div>
        )}
      </>
    );
}

export default Badge;