import React, { useMemo } from "react";
import classNames from "classnames";

const TableRow = ({
    section,
    columns,
    row,
    rowIndex,
    isExpanded,
    onExpand,
}) => {
    const classes = classNames(
        'table-row',
        {
            'table-row--expanded': isExpanded && rowIndex !== 0,
        }
    )

    const arrowIcon = useMemo(() => {
        if (row.BidDirection === "-1") {
            return 'ex-arrow ex-down'
        } else if (row.BidDirection === "1") {
            return 'ex-arrow ex-up'
        } else {
            return 'ex-arrow ex-right'
        }
    }, [row]);

    const onClick = () => {
        if (rowIndex === 0) {
            onExpand(section);
        }
    }

    return (
        <tr
            className={classes}
            onClick={onClick}>
            <td className="pair">
                <strong>{section}</strong>
            </td>
            <td>{row.Spread}</td>
            <td>{row.BidSize}</td>
            <td>
                <i className={arrowIcon} />
            </td>
            <td>{row.BidPx}</td>
            <td>{row.AskPx}</td>
            <td>{row.AskSize}</td>
        </tr>
    )
}

export default TableRow;
