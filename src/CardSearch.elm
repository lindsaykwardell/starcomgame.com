module CardSearch exposing (main)

import Browser
import Csv.Decode as Decode exposing (Decoder)
import Html exposing (..)
import Html.Attributes exposing (alt, attribute, class, src, title, value)
import Html.Events exposing (onClick, onInput)
import Http
import List.Extra as List


type alias Model =
    { cardList : List Card
    , searchTerm : String
    , selectedCard : Maybe Int
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


domainToString : Domain -> String
domainToString domain =
    case domain of
        Industry ->
            "Industry"

        Politics ->
            "Politics"

        Science ->
            "Science"

        Neutral ->
            ""


domainToClass : Domain -> String
domainToClass domain =
    case domain of
        Industry ->
            "domain-industry"

        Politics ->
            "domain-politics"

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
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( { cardList = [], searchTerm = "", selectedCard = Nothing }
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
    | SelectCard Int
    | ReturnToCardList


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

        SelectCard cardId ->
            ( { model | selectedCard = Just cardId }, Cmd.none )

        ReturnToCardList ->
            ( { model | selectedCard = Nothing }, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "w-screen" ]
        [ h1 [ class "text-4xl font-megrim text-center py-6" ] [ text "Cards Database" ]
        , div [ class "w-5/6 md:w-[500px] m-auto pb-6" ]
            [ label [] [ text "Filter cards by name and rules text", input [ class "w-full bg-gray-700 text-white p-1 shadow", value model.searchTerm, onInput UpdateSearchTerm ] [] ]
            ]
        , case model.selectedCard of
            Just cardId ->
                case List.find (\card -> card.id == cardId) model.cardList of
                    Just card ->
                        div [ class "w-11/12 md:w-5/6 lg:w-4/5 xl:w-2/3 flex flex-col m-auto shadow" ]
                            [ h2 [ class "text-4xl font-megrim text-center py-6" ] [ text "Card Details" ]
                            , div [ class "w-full bg-gray-900 m-auto" ]
                                [ displaySelectedCard card
                                ]
                            ]

                    Nothing ->
                        div [ class "w-full md:w-[500px] m-auto" ]
                            [ div [ class "w-full bg-gray-600 text-white p-1" ] [ text "Card not found" ]
                            ]

            Nothing ->
                div [ class "flex flex-wrap justify-around gap-4 p-2 w-full md:w-5/6 lg:w-2/3 m-auto" ]
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


displayCard : Card -> Html Msg
displayCard card =
    button [ onClick <| SelectCard card.id ]
        [ img
            [ class
                (case card.cardType of
                    System _ ->
                        "hover:border hover:border-white rounded-lg w-60"

                    _ ->
                        "hover:border hover:border-white rounded-lg h-60"
                )
            , src <| "/cards/" ++ String.fromInt card.id ++ ".png"
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
                , src <| "/cards/" ++ String.fromInt card.id ++ ".png"
                , alt ""
                ]
                []
            ]
        , div [ class "flex-grow order-1 flex flex-col" ]
            [ div [ class "relative border-b-2 mb-2 border-gray-500" ]
                [ h3 [ class "text-3xl italic py-6" ] [ text card.name ]
                , div [ class "absolute top-1 right-1 flex flex-col" ]
                    (case card.cardType of
                        System maxDev ->
                            [ div [] [ text <| "Max Development: " ++ String.fromInt maxDev ] ]

                        Ship _ stats ->
                            [ div [] [ text <| "Cost: " ++ String.fromInt stats.cost ]
                            , div [] [ text <| "Attack: " ++ String.fromInt stats.attack ]
                            , div [] [ text <| "Hull: " ++ String.fromInt stats.hp ]
                            ]

                        Station stats ->
                            [ div [] [ text <| "Cost: " ++ String.fromInt stats.cost ]
                            , div [] [ text <| "Attack: " ++ String.fromInt stats.attack ]
                            , div [] [ text <| "Hull: " ++ String.fromInt stats.hp ]
                            ]

                        _ ->
                            []
                    )
                ]
            , div [ class "text-2xl" ]
                [ case card.cardType of
                    Ship size stats ->
                        text <| "Ship - " ++ sizeToString size

                    Station _ ->
                        text "Station"

                    Command ->
                        text "Command"

                    Technology ->
                        text "Technology"

                    System _ ->
                        text "System"
                , if card.domain /= Neutral then
                    text " | "

                  else
                    text ""
                , span [ class <| "text-lg " ++ domainToClass card.domain ] [ text <| domainToString card.domain ]
                ]
            , div [ class "p-4 m-auto text-base lg:text-lg" ]
                [ if String.length card.rules > 0 then
                    text card.rules

                  else
                    div [ class "italic text-center text-sm text-gray-300" ] [ text "No rules text" ]
                ]
            , div [ class "text-center" ]
                [ button [ class "rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md", onClick ReturnToCardList ] [ text "Return to All Cards" ]
                ]
            ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
