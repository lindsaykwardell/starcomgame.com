module CardSearch exposing (main)

import Browser
import Csv.Decode as Decode exposing (Decoder)
import Html exposing (..)
import Html.Attributes exposing (class, src, value)
import Html.Events exposing (onInput)
import Http


type alias Model =
    { cardList : List Card
    , searchTerm : String
    }


type alias Card =
    { id : Int
    , name : String
    , domain : Domain
    , cardType : CardType
    , rules : String
    }


type Domain
    = Industry
    | Politics
    | Science
    | Neutral


type CardType
    = Ship Size Stats
    | Station Stats
    | Command
    | Technology
    | System Int


type Size
    = Fighter
    | Small
    | Medium
    | Large


type alias Stats =
    { cost : Int
    , attack : Int
    , hp : Int
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( { cardList = [], searchTerm = "" }
    , Cmd.batch [ fetchMainCsv, fetchPlanetCsv ]
    )


fetchMainCsv : Cmd Msg
fetchMainCsv =
    Http.get
        { url = "/cards/cardlist-main.csv"
        , expect = Http.expectString ParseMainCsv
        }


fetchPlanetCsv : Cmd Msg
fetchPlanetCsv =
    Http.get
        { url = "/cards/cardlist-planets.csv"
        , expect = Http.expectString ParsePlanetCsv
        }


decodeMainCsv : Decoder Card
decodeMainCsv =
    Decode.into Card
        |> Decode.pipeline (Decode.field "Card #" Decode.int)
        |> Decode.pipeline (Decode.field "Name" Decode.string)
        |> Decode.pipeline
            (Decode.field "Domain"
                (Decode.string
                    |> Decode.andThen
                        (\domain ->
                            case domain of
                                "Industry" ->
                                    Decode.succeed Industry

                                "Politics" ->
                                    Decode.succeed Politics

                                "Science" ->
                                    Decode.succeed Science

                                "Neutral" ->
                                    Decode.succeed Neutral

                                _ ->
                                    Decode.fail <| "Unknown domain, received " ++ domain
                        )
                )
            )
        |> Decode.pipeline
            (Decode.field "Card Types"
                (Decode.string
                    |> Decode.andThen
                        (\cardType ->
                            case cardType of
                                "Ship - Fighter" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "Shield" Decode.int)
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Fighter stats))

                                "Ship - Small" ->
                                    Decode.into Stats
                                        |> Decode.pipeline
                                            (Decode.field "Cost"
                                                (Decode.blank Decode.int
                                                    |> Decode.andThen
                                                        (\maybeCost ->
                                                            case maybeCost of
                                                                Just cost ->
                                                                    Decode.succeed cost

                                                                Nothing ->
                                                                    Decode.succeed 0
                                                        )
                                                )
                                            )
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "Shield" Decode.int)
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Small stats))

                                "Ship - Medium" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "Shield" Decode.int)
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Medium stats))

                                "Ship - Large" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "Shield" Decode.int)
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Large stats))

                                "Station" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "Shield" Decode.int)
                                        |> Decode.andThen (\stats -> Decode.succeed (Station stats))

                                "Command" ->
                                    Decode.succeed Command

                                "Technology" ->
                                    Decode.succeed Technology

                                -- "System" ->
                                --     Decode.field "MaxDev"
                                --         (Decode.int
                                --             |> Decode.andThen
                                --                 (\maxDev ->
                                --                     Decode.succeed (System maxDev)
                                --                 )
                                --         )
                                _ ->
                                    Decode.fail <| "Unknown card type, received " ++ cardType
                        )
                )
            )
        |> Decode.pipeline (Decode.field "Rules" Decode.string)


decodePlanetCsv : Decoder Card
decodePlanetCsv =
    Decode.into Card
        |> Decode.pipeline (Decode.field "Card #" Decode.int)
        |> Decode.pipeline (Decode.field "Name" Decode.string)
        |> Decode.pipeline
            (Decode.field "Domain"
                (Decode.string
                    |> Decode.andThen
                        (\domain ->
                            case domain of
                                "Industry" ->
                                    Decode.succeed Industry

                                "Politics" ->
                                    Decode.succeed Politics

                                "Science" ->
                                    Decode.succeed Science

                                _ ->
                                    Decode.succeed Neutral
                        )
                )
            )
        |> Decode.pipeline
            (Decode.field "Card Types"
                (Decode.string
                    |> Decode.andThen
                        (\cardType ->
                            Decode.field "MaxDev"
                                (Decode.blank Decode.int
                                    |> Decode.andThen
                                        (\maybeDev ->
                                            case maybeDev of
                                                Just maxDev ->
                                                    Decode.succeed <| System maxDev

                                                Nothing ->
                                                    Decode.succeed <| System 0
                                        )
                                )
                        )
                )
            )
        |> Decode.pipeline (Decode.field "Rules" Decode.string)


type Msg
    = NoOp
    | ParseMainCsv (Result Http.Error String)
    | ParsePlanetCsv (Result Http.Error String)
    | UpdateSearchTerm String


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        ParseMainCsv (Ok result) ->
            case result |> Decode.decodeCsv Decode.FieldNamesFromFirstRow decodeMainCsv of
                Ok cards ->
                    ( { model | cardList = model.cardList ++ cards }, Cmd.none )

                Err err ->
                    ( model, Cmd.none )

        ParseMainCsv err ->
            ( model, Cmd.none )

        ParsePlanetCsv (Ok result) ->
            case result |> Decode.decodeCsv Decode.FieldNamesFromFirstRow decodePlanetCsv of
                Ok cards ->
                    ( { model | cardList = model.cardList ++ cards }, Cmd.none )

                Err err ->
                    ( model, Cmd.none )

        ParsePlanetCsv err ->
            ( model, Cmd.none )

        UpdateSearchTerm searchTerm ->
            ( { model | searchTerm = searchTerm }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ h1 [ class "text-4xl font-megrim text-center py-6" ] [ text "Cards Database" ]
        , div [ class "w-full md:w-[500px] m-auto" ]
            [ input [ class "w-full bg-gray-600 text-white p-1", value model.searchTerm, onInput UpdateSearchTerm ] []
            ]
        , div [ class "flex flex-wrap justify-around gap-4 p-2 w-full md:w-5/6 lg:w-2/3 m-auto" ]
            (model.cardList
                |> List.filter
                    (\card ->
                        let
                            searchTerm =
                                String.toLower model.searchTerm

                            name =
                                String.toLower card.name

                            rules =
                                String.toLower card.rules
                        in
                        String.contains searchTerm name || String.contains searchTerm rules
                    )
                |> List.sortBy .id
                |> List.map displayCard
            )
        ]


displayCard : Card -> Html msg
displayCard card =
    div []
        [ img
            [ class
                (case card.cardType of
                    System _ ->
                        "w-48 h-38"

                    _ ->
                        "w-38 h-48"
                )
            , src <| "/cards/" ++ String.fromInt card.id ++ ".png"
            ]
            []
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
