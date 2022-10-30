module Card exposing (..)

import Csv.Decode as Decode exposing (Decoder)
import Http


type alias Card =
    { id : Int
    , name : String
    , domain : Domain
    , cardType : CardType
    , rules : String
    }


cardImg : Card -> Bool -> String
cardImg card isThumb =
    "/cards/"
        ++ String.replace " " "_" card.name
        ++ (if isThumb then
                "-thumb"

            else
                ""
           )
        ++ ".webp"


cardLink : Card -> String
cardLink card =
    "/card-database?selectedCard=" ++ String.replace " " "_" card.name


type Domain
    = Industry
    | Statecraft
    | Science
    | Neutral


domainToString : Domain -> String
domainToString domain =
    case domain of
        Industry ->
            "Industry"

        Statecraft ->
            "Statecraft"

        Science ->
            "Science"

        Neutral ->
            ""


domainToClass : Domain -> String
domainToClass domain =
    case domain of
        Industry ->
            "domain-industry"

        Statecraft ->
            "domain-statecraft"

        Science ->
            "domain-science"

        Neutral ->
            "domain-neutral"


type CardType
    = Ship Size Stats
    | Station Stats
    | Command
    | Technology
    | System Int


cardTypeToString : Card -> String
cardTypeToString card =
    case card.cardType of
        Ship size _ ->
            "Ship - "
                ++ sizeToString size

        Station _ ->
            "Station"

        Command ->
            "Command"

        Technology ->
            "Technology"

        System _ ->
            "System"


type Size
    = Fighter
    | Small
    | Medium
    | Large


sizeToString : Size -> String
sizeToString size =
    case size of
        Fighter ->
            "Fighter"

        Small ->
            "Small"

        Medium ->
            "Medium"

        Large ->
            "Large"


type alias Stats =
    { cost : Int
    , attack : Int
    , hp : Int
    , speed : Maybe Int
    }


fetchMainCsv : (Result Http.Error String -> msg) -> Cmd msg
fetchMainCsv msg =
    Http.get
        { url = "/cards/cardlist-main.csv"
        , expect = Http.expectString msg
        }


fetchPlanetCsv : (Result Http.Error String -> msg) -> Cmd msg
fetchPlanetCsv msg =
    Http.get
        { url = "/cards/cardlist-planets.csv"
        , expect = Http.expectString msg
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

                                "Statecraft" ->
                                    Decode.succeed Statecraft

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
                                        |> Decode.pipeline (Decode.field "HP" Decode.int)
                                        |> Decode.pipeline
                                            (Decode.field "Speed"
                                                (Decode.string
                                                    |> Decode.andThen
                                                        (String.toInt >> Decode.succeed)
                                                )
                                            )
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Fighter stats))

                                "Ship - Small" ->
                                    Decode.into Stats
                                        |> Decode.pipeline
                                            (Decode.field "Cost"
                                                (Decode.blank Decode.int
                                                    |> Decode.andThen
                                                        (\cost ->
                                                            case cost of
                                                                Nothing ->
                                                                    Decode.succeed 0

                                                                Just c ->
                                                                    Decode.succeed c
                                                        )
                                                )
                                            )
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "HP" Decode.int)
                                        |> Decode.pipeline
                                            (Decode.field "Speed"
                                                (Decode.string
                                                    |> Decode.andThen
                                                        (String.toInt >> Decode.succeed)
                                                )
                                            )
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Small stats))

                                "Ship - Medium" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "HP" Decode.int)
                                        |> Decode.pipeline
                                            (Decode.field "Speed"
                                                (Decode.string
                                                    |> Decode.andThen
                                                        (String.toInt >> Decode.succeed)
                                                )
                                            )
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Medium stats))

                                "Ship - Large" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "HP" Decode.int)
                                        |> Decode.pipeline
                                            (Decode.field "Speed"
                                                (Decode.string
                                                    |> Decode.andThen
                                                        (String.toInt >> Decode.succeed)
                                                )
                                            )
                                        |> Decode.andThen (\stats -> Decode.succeed (Ship Large stats))

                                "Station" ->
                                    Decode.into Stats
                                        |> Decode.pipeline (Decode.field "Cost" Decode.int)
                                        |> Decode.pipeline (Decode.field "Attack" Decode.int)
                                        |> Decode.pipeline (Decode.field "HP" Decode.int)
                                        |> Decode.pipeline
                                            (Decode.field "Speed"
                                                (Decode.string
                                                    |> Decode.andThen
                                                        (String.toInt >> Decode.succeed)
                                                )
                                            )
                                        |> Decode.andThen (\stats -> Decode.succeed (Station stats))

                                "Command" ->
                                    Decode.succeed Command

                                "Technology" ->
                                    Decode.succeed Technology

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

                                "Statecraft" ->
                                    Decode.succeed Statecraft

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
                        (\_ ->
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
