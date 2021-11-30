import TableRow from "../Row/TableRow";
import { useMemo } from "react";

const TableSection = ({
    section,
    rows,
    columns,
    expandedRow,
    onExpandRow,
}) => {
    const visibleRows = useMemo(() => {
        if (expandedRow === section) {
            return rows.slice(0, 6);
        }

        return rows.slice(0, 1);
    }, [rows, expandedRow, section]);

    return (
        <>
            {
                visibleRows.map((row, index) =>
                    <TableRow
                        key={`${section}|${index}`}
                        section={section}
                        row={row}
                        rowIndex={index}
                        columns={columns}
                        isExpanded={expandedRow === section}
                        onExpand={onExpandRow} />
                )
            }
        </>
    )
}

export default TableSection;
