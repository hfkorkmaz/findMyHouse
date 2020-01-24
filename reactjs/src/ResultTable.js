import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import RoomIcon from "@material-ui/icons/Room";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

export default function CustomizedTables(props) {
  const classes = useStyles();

  const [houseId, setHouseId] = React.useState("");

  const onMapIconClick = row => {
    if (houseId === `${row.ahpScore}${row.netm2}`) {
      setHouseId("");
      props.clearSelectedHouses();
    } else {
      setHouseId(`${row.ahpScore}${row.netm2}`);
      props.handleMapIconClick(row);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>AHP Score</StyledTableCell>
            <StyledTableCell align="right">Net m2</StyledTableCell>
            <StyledTableCell align="right">Number of Rooms</StyledTableCell>
            <StyledTableCell align="right">Age of the Building</StyledTableCell>
            <StyledTableCell align="right">Socioeconomic Score</StyledTableCell>
            <StyledTableCell align="right">Neighbourhood</StyledTableCell>
            <StyledTableCell align="right">District</StyledTableCell>

            <StyledTableCell align="right">Price&nbsp;(TL)</StyledTableCell>
            <StyledTableCell align="right">&nbsp;</StyledTableCell>
            <StyledTableCell align="right">&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(row => (
            <StyledTableRow key={row.İlanno}>
              <StyledTableCell component="th" scope="row">
                {row.ahpScore}
              </StyledTableCell>
              <StyledTableCell align="right">{row.netm2}</StyledTableCell>
              <StyledTableCell align="right">
                {row.numberOfRooms}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.ageOfBuilding}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.sosyoekonomikScore}
              </StyledTableCell>
              <StyledTableCell align="right">{row.mahalle}</StyledTableCell>
              <StyledTableCell align="right">{row.ilce}</StyledTableCell>

              <StyledTableCell align="right">{row.price}</StyledTableCell>
              {houseId === `${row.ahpScore}${row.netm2}` ? (
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    style={{ fontSize: "rem", padding: "1px!important" }}
                    onClick={() => onMapIconClick(row)}
                  >
                    <RoomIcon />
                  </IconButton>
                </StyledTableCell>
              ) : (
                <StyledTableCell align="right">
                  <IconButton
                    style={{ fontSize: "rem", padding: "1px!important" }}
                    onClick={() => onMapIconClick(row)}
                  >
                    <RoomIcon />
                  </IconButton>
                </StyledTableCell>
              )}
              <StyledTableCell align="right">
                <IconButton
                  color="primary"
                  style={{ fontSize: "rem", padding: "1px!important" }}
                  href={`https://www.zingat.com${row.link}`}
                  target="_blank"
                >
                  <LinkIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
