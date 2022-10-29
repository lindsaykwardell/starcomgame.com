port module CardSearch exposing (main)

import Browser
import Csv.Decode as Decode exposing (Decoder)
import Debounce
import Html exposing (..)
import Html.Attributes exposing (alt, attribute, class, src, title, value)
import Html.Events exposing (onClick, onInput)
import Http
import List.Extra as List


type alias Model =
    { cardList : List Card
    , searchTerm : String
    , selectedCard : Maybe String
    , debounce : Debounce.Debounce String
    }


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


type alias Flags =
    { searchTerm : String
    , selectedCard : Maybe String
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { cardList = []
      , searchTerm = flags.searchTerm
      , selectedCard = flags.selectedCard
      , debounce = Debounce.init
      }
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
    | DebounceMsg Debounce.Msg
    | SelectCard Card
    | ReturnToCardList


debounceConfig =
    { strategy = Debounce.later (1 * 1000)
    , transform = DebounceMsg
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        ParseMainCsv (Ok result) ->
            case result |> Decode.decodeCsv Decode.FieldNamesFromFirstRow decodeMainCsv of
                Ok cards ->
                    ( { model | cardList = updateCardList model.cardList cards }, Cmd.none )

                Err err ->
                    ( model, Cmd.none )

        ParseMainCsv err ->
            ( model, Cmd.none )

        ParsePlanetCsv (Ok result) ->
            case result |> Decode.decodeCsv Decode.FieldNamesFromFirstRow decodePlanetCsv of
                Ok cards ->
                    ( { model | cardList = updateCardList model.cardList cards }, Cmd.none )

                Err err ->
                    ( model, Cmd.none )

        ParsePlanetCsv err ->
            ( model, Cmd.none )

        UpdateSearchTerm searchTerm ->
            let
                ( debounce, cmd ) =
                    Debounce.push debounceConfig searchTerm model.debounce
            in
            ( { model | searchTerm = searchTerm, debounce = debounce }, cmd )

        DebounceMsg msg_ ->
            let
                ( debounce, cmd ) =
                    Debounce.update
                        debounceConfig
                        (Debounce.takeLast setSearchTerm)
                        msg_
                        model.debounce
            in
            ( { model | debounce = debounce }
            , cmd
            )

        SelectCard card ->
            ( { model | selectedCard = Just <| String.replace " " "_" card.name }, setSelectedCard <| Just (String.replace " " "_" card.name) )

        ReturnToCardList ->
            ( { model | selectedCard = Nothing }, setSelectedCard <| Nothing )


updateCardList : List Card -> List Card -> List Card
updateCardList cardList cards =
    cardList
        ++ cards
        |> List.sortWith
            (\a b ->
                case ( a.cardType, b.cardType ) of
                    ( System _, System _ ) ->
                        compare a.name b.name

                    ( System _, _ ) ->
                        GT

                    ( _, System _ ) ->
                        LT

                    _ ->
                        case compare (domainToString a.domain) (domainToString b.domain) of
                            LT ->
                                LT

                            GT ->
                                GT

                            EQ ->
                                compare a.name b.name
            )


view : Model -> Html Msg
view model =
    div [ class "w-screen" ]
        [ h1 [ class "text-4xl font-megrim text-center py-6" ] [ text "Cards Database" ]
        , div [ class "w-5/6 md:w-[500px] m-auto pb-6" ]
            [ label [] [ text "Filter cards by name and rules text", input [ class "w-full bg-gray-700 text-white p-1 shadow", value model.searchTerm, onInput UpdateSearchTerm ] [] ]
            ]
        , case model.selectedCard of
            Just cardName ->
                case List.find (\card -> String.replace " " "_" card.name == cardName) model.cardList of
                    Just card ->
                        div [ class "w-11/12 md:w-5/6 lg:w-4/5 xl:w-2/3 flex flex-col m-auto shadow" ]
                            [ h2 [ class "text-4xl font-megrim text-center py-6" ] [ text "Card Details" ]
                            , div [ class "w-full bg-gray-900 m-auto" ]
                                [ displaySelectedCard card
                                ]
                            ]

                    Nothing ->
                        div [ class "w-full md:w-[500px] m-auto" ]
                            [ div [ class "w-full bg-gray-600 text-white p-4 text-center" ]
                                [ div [] [ text "Card not found" ]
                                , returnToAllCardsButton
                                ]
                            ]

            Nothing ->
                text ""
        , div
            [ class <|
                "flex flex-col md:flex-row flex-wrap justify-around gap-4 p-2 w-full md:w-5/6 lg:w-2/3 m-auto"
                    ++ (if model.selectedCard /= Nothing then
                            " hidden"

                        else
                            ""
                       )
            ]
            (model.cardList
                |> List.map (displayCard model.searchTerm)
            )
        ]


displayCard : String -> Card -> Html Msg
displayCard searchTerm card =
    let
        term =
            String.toLower searchTerm

        name =
            String.toLower card.name

        rules =
            String.toLower card.rules

        cardType =
            cardTypeToString card
                |> String.toLower
    in
    button
        [ class <|
            "m-auto"
                ++ (if String.contains term name || String.contains term rules || String.contains term cardType then
                        ""

                    else
                        " hidden"
                   )
        , onClick <| SelectCard card
        ]
        [ img
            [ class <|
                case card.cardType of
                    System _ ->
                        "hover:border hover:border-white rounded-lg w-60"

                    _ ->
                        "hover:border hover:border-white rounded-lg h-60"
            , src <| cardImg card True
            , attribute "loading" "lazy"
            , alt card.name
            , title card.name
            ]
            []
        ]


displaySelectedCard : Card -> Html Msg
displaySelectedCard card =
    div [ class "flex gap-4 p-2 flex-col lg:flex-row" ]
        [ div [ class "w-full lg:w-96 shrink-0" ]
            [ img
                [ class
                    (case card.cardType of
                        System _ ->
                            "rounded-lg m-auto w-96"

                        _ ->
                            "rounded-lg m-auto h-96"
                    )
                , src <| cardImg card False
                , alt ""
                ]
                []
            ]
        , div [ class "flex-grow order-1 flex flex-col" ]
            [ div [ class "relative border-b-2 mb-2 border-gray-500" ]
                [ h3 [ class "text-3xl italic py-9" ] [ text card.name ]
                , div [ class "md:absolute top-1 right-1 flex flex-row md:flex-col justify-around" ]
                    (case card.cardType of
                        System maxDev ->
                            [ div [] [ text <| "Max Development: " ++ String.fromInt maxDev ] ]

                        Ship _ stats ->
                            viewVesselStats stats

                        Station stats ->
                            viewVesselStats stats

                        _ ->
                            []
                    )
                ]
            , div [ class "text-2xl" ]
                [ cardTypeToString card |> text
                , text
                    (if card.domain /= Neutral then
                        " | "

                     else
                        ""
                    )
                , span [ class <| "text-lg " ++ domainToClass card.domain ] [ text <| domainToString card.domain ]
                ]
            , div [ class "p-4 m-auto text-base lg:text-lg" ]
                [ if String.length card.rules > 0 then
                    text card.rules

                  else
                    div [ class "italic text-center text-sm text-gray-300" ] [ text "No rules text" ]
                ]
            , div [ class "text-center" ]
                [ returnToAllCardsButton
                ]
            ]
        ]


viewVesselStats : Stats -> List (Html Msg)
viewVesselStats stats =
    [ div [] [ text <| "Cost: " ++ String.fromInt stats.cost ]
    , div [] [ text <| "Attack: " ++ String.fromInt stats.attack ]
    , div [] [ text <| "Hit Points: " ++ String.fromInt stats.hp ]
    , div [] [ text <| "Speed: " ++ (stats.speed |> Maybe.map String.fromInt |> Maybe.withDefault "-") ]
    ]


returnToAllCardsButton : Html Msg
returnToAllCardsButton =
    button [ class "rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md", onClick ReturnToCardList ] [ text "Return to All Cards" ]


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions =
            \model ->
                Sub.batch
                    [ updateSelectedCard
                        (\value ->
                            if String.length value == 0 then
                                ReturnToCardList

                            else
                                case List.find (\card -> card.name == String.replace "_" " " value) model.cardList of
                                    Just card ->
                                        SelectCard card

                                    Nothing ->
                                        UpdateSearchTerm value
                        )
                    , updateSearchTerm UpdateSearchTerm
                    ]
        }


port updateSelectedCard : (String -> msg) -> Sub msg


port updateSearchTerm : (String -> msg) -> Sub msg


port setSearchTerm : String -> Cmd msg


port setSelectedCard : Maybe String -> Cmd msg
