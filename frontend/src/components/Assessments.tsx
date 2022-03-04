import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditCommitParams,
  GridRowId,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Assessment, addAssessment, deleteAssessment } from "../store/courses";

interface lstType {
  tableData: Assessment[];
  setTableData: Dispatch<SetStateAction<Assessment[]>>;
}
function Assessments({ tableData, setTableData }: lstType) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addAsssessmentInfo, setAddAsssessmentInfo] = useState({
    name: "",
    customReminder: "", // Need to be date, error in database
    deadline: "", // Need to be date, error in database
    isCompleted: false, // Need to be boolean, error in database
    mark: 0,
    reminder: "", // Need to be date, error in database
    weight: 0,
  });
  const deleteAssesments = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setTableData((tableData) => tableData.filter((row) => row.name !== id));
      });
    },
    []
  );

  const updateAssessments = React.useCallback(
    (id) => () => {
      // TODO: fix this to update state variables
      setTimeout(() => {
        console.log(id);
        setTableData([...tableData]);
      });
    },
    []
  );
  const columns = [
    //   { field: "id", headerName: "ID", width: 0 },
    //   { field: "status", headerName: "Status", width: 100 },
    {
      field: "name",
      headerName: "Assessment",
      editable: true,
      minWidth: 100,
      flex: 1,
    },
    {
      field: "weight",
      headerName: "Weight",
      editable: true,
      type: "number",
      flex: 0.5,
    },
    {
      field: "mark",
      headerName: "Mark",
      editable: true,
      type: "number",
      flex: 0.5,
    },
    {
      field: "deadline",
      headerName: "Due Date",
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "date",
    }, //, type: "date"
    {
      field: "customReminder",
      headerName: "Reminder",
      editable: true,
      inWidth: 200,
      flex: 1,
      type: "date",
    }, //, type: "date"

    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params: { id: any }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteAssesments(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "10px" }}
        mx={3}
        my={2}
      >
        <Typography variant="h2">Assessments</Typography>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{ color: "white" }}
          onClick={() => setIsAddOpen(true)}
        >
          Add Assessment
        </Button>
      </Box>
      <Box
        sx={{ backgroundColor: "highlight.main", borderRadius: 2 }}
        p={2}
        mx={3}
        my={2}
        width="full"
        height="100%"
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <DataGrid
              getRowId={(row) => row.name}
              rows={tableData}
              columns={columns}
              autoHeight
              onCellEditCommit={(params: GridCellEditCommitParams) => {
                const changedRow =
                  tableData[
                    tableData.findIndex((element) => element.name === params.id)
                  ];
                setTableData([
                  ...tableData.filter((row) => row.name !== params.id),
                  { ...changedRow, [params.field]: params.value },
                ]);
              }}
            />
          </div>
        </div>
        {/* Add Assessment Dialog */}
        <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)}>
          <DialogTitle>Add Assessment</DialogTitle>
          <DialogContent>
            <DialogContentText color="white">
              Please fill in the following details to create an assessment.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Assignment name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setAddAsssessmentInfo((addAssessment) => ({
                  ...addAssessment,
                  name: e.target.value,
                }));
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Weightage"
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setAddAsssessmentInfo((addAssessment) => ({
                  ...addAssessment,
                  weight: parseFloat(e.target.value),
                }));
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Deadline date"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setAddAsssessmentInfo((addAssessment) => ({
                  ...addAssessment,
                  deadline: e.target.value,
                }));
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Notification date"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setAddAsssessmentInfo((addAssessment) => ({
                  ...addAssessment,
                  customReminder: e.target.value,
                }));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setTableData([...tableData, addAsssessmentInfo]);
                setIsAddOpen(false);
              }}
            >
              Add Assessment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Assessments;
