"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.min.css";
import tablePositions from "@/components/market/tableProps/tablePositions";
import tableValues from "@/components/market/tableProps/tableValues";
import tableClubLogos from "@/components/market/tableProps/tableClubLogos";
import tableSubidasBajadas from "@/components/market/tableProps/tableSubidasBajadas";
import tablePlayerNames from "@/components/market/tableProps/tablePlayerNames";
import tablePlayerImg from "@/components/market/tableProps/tablePlayerImg";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import RectangleRoundedIcon from "@mui/icons-material/RectangleRounded";
import HelpIcon from "@mui/icons-material/Help";
import {
  getAllPlayers,
  getAllStats,
  getMatchesByTeamID,
  getAllTeams,
} from "@/utils/supabase/functions";
import {
  getColor,
  formatDate,
  formatMoney,
  getWeeksTotalPointsFromStats,
  getNextThreeMatches,
  createColumnDefs,
  getStadiumByTeamID,
} from "@/utils/utils";
// import { useTheme } from "next-themes";
import Image from "next/image";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { slugById } from "@/utils/utils";
import useSWR from "swr";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ModalValueChart from "../player/ModalValueChart";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const NewMarketUp = () => {
  const { data: playersWithStats, error } = useSWR(
    ["getAllPlayers", "getAllStats"],
    async () => {
      const { allPlayers: players } = (await getAllPlayers()) as {
        allPlayers: players[];
      };
      const { allStats: stats } = (await getAllStats()) as {
        allStats: stats[];
      };

      return formatPlayersWithStats(players, stats);
    }
  );

  const { data: allTeams } = useSWR("getAllTeams", async () => {
    const { allTeams: teams } = (await getAllTeams()) as { allTeams: teams[] };

    return teams;
  });

  function formatPlayersWithStats(players: players[], stats: stats[]) {
    const formattedPlayers = [];

    for (const player of players) {
      const playerStats = stats.filter(
        (stat) => stat.playerID === player.playerID
      );
      formattedPlayers.push({ playerData: player, stats: playerStats });
    }

    return formattedPlayers;
  }
  const [selectedPlayer, setSelectedPlayer] = useState<players | null>(null);

  const [open, setOpen] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePlayerSelection = async (player: players) => {
    if (player) {
      const { teamMatches } = await getMatchesByTeamID(
        player.playerData.teamID
      );
      if (teamMatches) {
        setTeamMatches(teamMatches as matches[]);
        handleOpen();
      } else {
        setTeamMatches([]);
      }
    }
  };

  const prepareValueChangesData = (playerId: number) => {
    const playerData = playersWithStats?.find(
      (player) => player.playerData.playerID === playerId
    );

    if (playerData && playerData.playerData.marketValues) {
      const marketValues = playerData.playerData.marketValues;

      const playerValueChanges = [];

      for (let i = 1; i < marketValues.length; i++) {
        const currentDate = marketValues[i].date;
        const previousDate = marketValues[i - 1].date;
        const currentValue = marketValues[i].marketValue;
        const previousValue = marketValues[i - 1].marketValue;

        const valueChange = currentValue - previousValue;
        const percentageChange =
          ((currentValue - previousValue) / previousValue) * 100; // Calculate the percentage change
        const newValue = currentValue; // Calculate the new value

        playerValueChanges.push({
          date: currentDate,
          valueChange,
          percentageChange,
          newValue, // Include the new value in the object
        });
      }

      // Reverse the array to display the most recent changes first
      const last20ValueChanges = playerValueChanges.reverse().slice(0, 30); // Slice to include only the last 30 entries

      return last20ValueChanges;
    }
    return [];
  };

  const marketValueDates = selectedPlayer?.playerData?.marketValues
    ? selectedPlayer.playerData.marketValues.map(
        (entry) => new Date(entry.date)
      )
    : [];

  const marketValueList = selectedPlayer?.playerData?.marketValues
    ? selectedPlayer.playerData.marketValues.map((entry) => entry.marketValue)
    : [];

  // const preparePlayerStats = (playerId: number) => {
  //   const playerData = playersWithStats?.find(
  //     (player) => player.playerData.playerID === playerId
  //   );

  //   if (playerData) {
  //     const playerStats = playerData.stats.map((stat) => {
  //       return {
  //         week: stat.week,
  //         points: stat.points,

  //       };
  //     });

  //     return playerStats;
  //   }
  //   return [];
  // }

  const [teamMatches, setTeamMatches] = useState<matches[]>([]);

  const cellRenderers = {
    tablePlayerImg,
    tablePlayerNames,
    tablePositions,
    tableValues,
    tableClubLogos,
    tableSubidasBajadas,
  };
  const columnDefs = createColumnDefs(cellRenderers, "desc");

  const defaultColDef = {
    resizable: false,
    sortable: false,
  };

  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onFirstDataRendered = useCallback((params = {}) => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridSizeChanged = useCallback((params = {}) => {
    // get the current grids width
    var gridWidth = document.getElementById("mySubidasGrid")?.offsetWidth;
    // keep track of which columns to hide/show
    var columnsToShow = [];
    var columnsToHide = [];
    // iterate over all columns (visible or not) and work out
    // now many columns can fit (based on their minWidth)
    var totalColsWidth = 0;
    var allColumns = gridRef.current?.columnApi.getColumns();
    if (allColumns && allColumns.length > 0) {
      for (var i = 0; i < allColumns.length; i++) {
        var column = allColumns[i];
        totalColsWidth += column.getMinWidth() || 0;
        if (gridWidth !== undefined && totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      }
    }
    // show/hide columns based on current grid width
    gridRef.current?.columnApi.setColumnsVisible(columnsToShow, true);
    gridRef.current?.columnApi.setColumnsVisible(columnsToHide, false);
    // fill out any available space to ensure there are no gaps
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  function onGridReady(params: any) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    gridApiRef.current = params.api;
  }
  const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gridApi) {
      gridApiRef.current.setQuickFilter(e.target.value);
    }
  };

  let nextThreeMatches: matches[] = [];

  if (selectedPlayer) {
    nextThreeMatches = getNextThreeMatches(teamMatches, selectedPlayer);
  }

  return (
    <>
      {selectedPlayer && (
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          // sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", zIndex: 1 }}
          slots={{
            backdrop: Backdrop,
          }}
          slotProps={{
            backdrop: {
              timeout: 400,
            },
          }}
          className="flex justify-center items-center "
        >
          <Fade
            in={open}
            // timeout={{ enter: 100, exit: 100 }}
            // style={{ transitionDelay: open ? "0ms" : "0ms" }} // Adjust this value
          >
            <Card className=" w-[340px] h-fit p-4 transition-all absolute outline-none  flex flex-col justify-between  ">
              <Card className="relative py-2 px-4 flex flex-col justify-start items-center   ">
                <div className="z-40 flex flex-row justify-center items-center mb-2 w-full ">
                  <div className="text-lg font-bold uppercase text-center w-min whitespace-nowrap	 ">
                    {selectedPlayer.playerData.nickname}
                  </div>
                  <Separator orientation="vertical" className="mx-2 " />
                  <Image
                    src={`/teamLogos/${slugById(
                      selectedPlayer.playerData.teamID
                    )}.png`}
                    alt={selectedPlayer.playerData.teamName}
                    width={28}
                    height={28}
                    className="h-6 w-auto"
                  />
                </div>

                <div className="z-40 flex flex-col justify-between items-start h-full w-full">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col justify-center items-start gap-y-1 text-sm">
                      <div className="flex flex-row justify-center items-center gap-x-2">
                        Puntos:{" "}
                        <div className="font-bold">
                          {selectedPlayer.playerData.points}
                        </div>
                      </div>
                      <div className="flex flex-row justify-center items-center gap-x-2">
                        Media:{" "}
                        <div className="font-bold">
                          {selectedPlayer.playerData.averagePoints.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-row justify-center items-center gap-x-2">
                        Precio:{" "}
                        <div className="font-bold">
                          {formatMoney(selectedPlayer.playerData.marketValue)}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/player/${selectedPlayer.playerData.playerID}`}
                      className=" flex flex-row justify-center items-end gap-y-2 w-fit"
                    >
                      <div className="relative  ">
                        <Image
                          src={selectedPlayer.playerData.image}
                          alt={selectedPlayer.playerData.nickname}
                          width={72}
                          height={72}
                          className="h-16 w-auto "
                        />

                        {selectedPlayer.playerData.status === "injured" && (
                          <LocalHospitalIcon
                            className="absolute z-10 top-0 right-0 text-base text-red-500"
                            style={{ fontSize: 18 }}
                          />
                        )}
                        {selectedPlayer.playerData.status === "suspended" && (
                          <RectangleRoundedIcon
                            className="absolute z-10 top-0 right-0 text-red-500 -rotate-90 text-base"
                            color="inherit"
                            style={{ fontSize: 18 }}
                          />
                        )}
                        {selectedPlayer.playerData.status === "doubtful" && (
                          <HelpIcon
                            className="absolute z-10 top-0 right-0 text-base text-yellow-500"
                            color="inherit"
                            style={{ fontSize: 18 }}
                          />
                        )}
                      </div>

                      <div className="flex flex-col justify-center items-center ml-2">
                        <PersonSearchOutlinedIcon
                          className="text-gray-500 dark:text-gray-400"
                          fontSize="medium"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Ver+
                        </p>
                      </div>
                    </Link>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row items-center gap-x-1">
                      {playersWithStats &&
                        getWeeksTotalPointsFromStats(
                          selectedPlayer.playerData.playerID,
                          playersWithStats || [],
                          6
                        ).map((point) => {
                          const match = teamMatches?.find(
                            (match) => match.week === point.week
                          );

                          const showDash =
                            point.mins_played === null ||
                            point.mins_played === 0;

                          return (
                            <div
                              className="flex flex-col justify-center items-center"
                              key={point.week}
                            >
                              <div className="flex flex-col justify-center items-center">
                                {match &&
                                  match.localTeamID !==
                                    selectedPlayer.playerData.teamID && (
                                    <Image
                                      src={`/teamLogos/${slugById(
                                        match.localTeamID
                                      )}.png`}
                                      alt="opponent"
                                      width={20}
                                      height={20}
                                      style={{ objectFit: "contain" }}
                                      className="h-4 mb-1"
                                    />
                                  )}
                                {match &&
                                  match.visitorTeamID !==
                                    selectedPlayer.playerData.teamID && (
                                    <Image
                                      src={`/teamLogos/${slugById(
                                        match.visitorTeamID
                                      )}.png`}
                                      alt="opponent"
                                      width={20}
                                      height={20}
                                      style={{ objectFit: "contain" }}
                                      className="h-4 mb-1"
                                    />
                                  )}
                                <div
                                  className={`text-center border-[0.5px] w-5 h-5 border-neutral-700 rounded-xs flex justify-center items-center ${getColor(
                                    point.points,
                                    point.mins_played
                                  )}`}
                                >
                                  <p
                                    className={`text-[12px] items-center align-middle`}
                                  >
                                    {showDash ? "X" : point.points}
                                  </p>
                                </div>
                                <div className="text-center text-[11px]">
                                  J{point.week}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-center text-xs font-bold pb-1 uppercase">
                        Prox. Partidos
                      </p>
                      <div className="flex flex-row justify-center items-start gap-3">
                        {nextThreeMatches.map((match, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-start items-center "
                          >
                            {/* Display team logo for local team */}
                            {match.localTeamID !==
                              selectedPlayer.playerData.teamID && (
                              <Image
                                src={`/teamLogos/${slugById(
                                  match.localTeamID
                                )}.png`}
                                alt="opponent"
                                width={20}
                                height={20}
                                style={{ objectFit: "contain" }}
                                className="h-5 w-auto "
                              />
                            )}

                            {/* Display team logo for visitor team */}
                            {match.visitorTeamID !==
                              selectedPlayer.playerData.teamID && (
                              <Image
                                src={`/teamLogos/${slugById(
                                  match.visitorTeamID
                                )}.png`}
                                alt="opponent"
                                width={20}
                                height={20}
                                style={{ objectFit: "contain" }}
                                className="h-5 w-auto "
                              />
                            )}
                            <div className="">
                              {match.visitorTeamID !==
                              selectedPlayer.playerData.teamID ? (
                                <HomeIcon sx={{ fontSize: 18 }} />
                              ) : (
                                <FlightIcon
                                  sx={{ fontSize: 18 }}
                                  className="rotate-45"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inset-0 w-full h-full absolute  bg-white/40 z-30"></div>
                {/* BACKGROUND */}
                <div
                  className="inset-0 bg-no-repeat bg-center absolute z-0 w-full h-full bg-cover"
                  style={{
                    backgroundImage: `url(${getStadiumByTeamID(
                      selectedPlayer.playerData.teamID
                    )})`,
                    opacity: 0.15,
                  }}
                ></div>
              </Card>
              <Tabs defaultValue="table" className="grow w-full mx-auto">
                <TabsList className="flex flex-row justify-center items-center mt-2">
                  <TabsTrigger className="w-full" value="table">
                    Tabla
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="graph">
                    Grafica
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <Card className="h-[330px] pt-0 flex flex-col justify-between items-center  border-none shadow-none">
                    <Table className="m-auto w-auto mt-1">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-4 font-extrabold text-left w-[80px] text-xs">
                            Fecha
                          </TableHead>
                          <TableHead className="ml-2 flex flex-row justify-center items-center h-4 font-extrabold text-center text-xs">
                            <ChevronsDown
                              size={14}
                              className=" text-red-500 dark:text-red-400"
                            />
                            <ChevronsUp
                              size={14}
                              className="text-green-600 dark:text-green-400"
                            />
                          </TableHead>
                          <TableHead className="h-4 font-extrabold text-center text-xs">
                            %
                          </TableHead>
                          <TableHead className="h-4 font-extrabold text-right text-xs">
                            $ Actual
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prepareValueChangesData(
                          selectedPlayer.playerData.playerID
                        ).map((change, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-left py-1 text-xs tabular-nums tracking-tight w-fit whitespace-nowrap">
                              {formatDate(change.date)}
                            </TableCell>
                            <TableCell className="py-1 text-xs">
                              <div className="flex  flex-row items-center justify-end">
                                <div
                                  className={`font-bold tabular-nums tracking-tight 
                                          ${
                                            change.valueChange < 0
                                              ? "text-red-500 dark:text-red-400"
                                              : "text-green-600 dark:text-green-400"
                                          }`}
                                >
                                  {formatMoney(change.valueChange)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-1  ">
                              <div
                                className={`text-[11px] mr-2 font-semibold ml-2 tabular-nums tracking-tight text-right ${
                                  change.percentageChange < 0
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {change.percentageChange !== undefined
                                  ? `${change.percentageChange.toFixed(2)}%`
                                  : ""}
                              </div>
                            </TableCell>
                            <TableCell className="py-1 text-right text-xs  tabular-nums tracking-tighter	">
                              {formatMoney(change.newValue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <CardFooter className="pt-2 pb-0 text-xs  font-extralight">
                      Cambios de Valor (Ultimos 30 Dias)
                    </CardFooter>
                  </Card>{" "}
                </TabsContent>
                <TabsContent value="graph" className="h-fit ">
                  <Card className="h-[330px] w-full pt-0 flex flex-col justify-start items-center  border-none shadow-none">
                    <div className="flex flex-col w-full justify-start items-start ">
                      <ModalValueChart
                        fetchedPlayer={selectedPlayer.playerData}
                      />
                    </div>
                    <Separator className="mb-2" />
                    <div className="flex flex-col gap-4">
                      <div className="text-center">
                        <p className="text-center text-sm">Valor minimo:</p>
                        <span className="font-bold text-sm">
                          {marketValueList &&
                            Math.min(...marketValueList).toLocaleString(
                              "es-ES",
                              {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )}
                        </span>{" "}
                        <span className="text-xs text-gray-500 capitalize">
                          {marketValueList && marketValueDates
                            ? `(${new Date(
                                marketValueDates[
                                  marketValueList.indexOf(
                                    Math.min(...marketValueList)
                                  )
                                ]
                              ).toLocaleDateString("es-EU", {
                                month: "short",
                                day: "numeric",
                              })})`
                            : "(N/A)"}
                        </span>
                      </div>

                      <div className="text-center">
                        <p className="text-center text-sm">Valor maximo:</p>
                        <span className="font-bold text-sm">
                          {marketValueList &&
                            Math.max(...marketValueList).toLocaleString(
                              "es-ES",
                              {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )}
                        </span>{" "}
                        <span className="text-xs text-gray-500 capitalize">
                          {marketValueList && marketValueDates
                            ? `(${new Date(
                                marketValueDates[
                                  marketValueList.indexOf(
                                    Math.max(...marketValueList)
                                  )
                                ]
                              ).toLocaleDateString("es-EU", {
                                month: "short",
                                day: "numeric",
                              })})`
                            : "(N/A)"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </Fade>
        </Modal>
      )}
      <Card
        className={
          "h-auto flex flex-col justify-start items-center transition-all  overflow-hidden "
        }
      >
        {/* <pre>{JSON.stringify(allTeams, null, 2)}</pre> */}
        {/* Search Bar */}
        <div
          className=" flex flex-row justify-between items-center w-full h-16 px-3 
        bg-gradient-to-b from-green-800/10 to-green-500/5 
        "
        >
          <div className=" z-40 flex justify-center items-center  font-semibold p-1 rounded mr-2 w-fit whitespace-nowrap text-center">
            <ChevronsUp
              size={24}
              className="text-green-600 dark:text-green-400 mr-2"
            />{" "}
            Ultimas Subidas
          </div>
          <div className=" z-40 relative w-full flex flex-row justify-center items-center ">
            <Input
              type="search"
              onChange={onFilterTextChange}
              placeholder="Buscar..."
              className="pl-10 outline-none text-md backdrop-blur-sm bg-white/70"
            />
            <Search className="absolute h-4 w-4 top-[10px] left-4 text-muted-foreground" />
          </div>
          {/* <div
            className="inset-0 bg-no-repeat bg-center absolute z-0 w-full h-full bg-cover"
            style={{
              backgroundImage: `url(./stadiums/grass.jpg)`,
              opacity: 0.3,
            }}
          ></div> */}
        </div>

        <div
          id="mySubidasGrid"
          className={`ag-theme-balham w-full  transition-all`}
        >
          <AgGridReact
            rowData={playersWithStats}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            ref={gridRef}
            domLayout={"autoHeight"}
            pagination={true}
            animateRows={true}
            paginationPageSizeSelector={false}
            defaultColDef={defaultColDef}
            paginationPageSize={24}
            onFirstDataRendered={onFirstDataRendered}
            onGridSizeChanged={onGridSizeChanged}
            suppressCellFocus={true}
            suppressMovableColumns={true}
            onRowClicked={(event) => {
              setSelectedPlayer(event.data);
              handlePlayerSelection(event.data);
            }}
          ></AgGridReact>
        </div>
      </Card>
    </>
  );
};

export default NewMarketUp;
