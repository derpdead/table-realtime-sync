import { useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';
import TableRow from "./Row/TableRow";
import TableSection from "./TableSection/TableSection";

const Table = ({
    columns,
    rows,
    expandedRow,
    onExpandRow,
}) => {
    const sections = useMemo(() => Object.keys(rows), [rows]);

    return (
        <table
            className={'table'}
            cellSpacing="0"
            cellPadding="0">
            <tbody>
                {
                    sections.map(section =>
                        <TableSection
                            key={section}
                            section={section}
                            rows={rows[section]}
                            columns={columns}
                            expandedRow={expandedRow}
                            onExpandRow={onExpandRow}
                        />
                    )
                }
            </tbody>
            <tfoot>
            <tr>
                {
                    columns.map(column =>
                        <th
                            key={column.key}
                            width={column.width}>
                            {column.label}
                        </th>
                    )
                }
            </tr>
            </tfoot>
        </table>
    )
}

export default Table;
