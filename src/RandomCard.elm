module RandomCard exposing (..)

import Browser
import Card exposing (..)
import Csv.Decode as Decode
import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import List.Extra as List
import Random
import Task
import Time
import Time.Extra as Time


type alias Flags =
    {}


type alias Model =
    { cardList : List Card
    , mainDeckLoaded : Bool
    , planetsDeckLoaded : Bool
    , selectedCard : Maybe Card
    }


type Msg
    = ParseMainCsv (Result Http.Error String)
    | ParsePlanetCsv (Result Http.Error String)
    | GetRandomCard Time.Posix


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( { cardList = []
      , mainDeckLoaded = False
      , planetsDeckLoaded = False
      , selectedCard = Nothing
      }
    , Cmd.batch
        [ fetchMainCsv ParseMainCsv
        , fetchPlanetCsv ParsePlanetCsv
        ]
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ParseMainCsv (Ok result) ->
            case result |> Decode.decodeCsv Decode.FieldNamesFromFirstRow decodeMainCsv of
                Ok cards ->
                    { model | cardList = updateCardList model.cardList cards, mainDeckLoaded = True }
                        |> maybeGetDate

                Err err ->
                    ( model, Cmd.none )

        ParseMainCsv err ->
            ( model, Cmd.none )

        ParsePlanetCsv (Ok result) ->
            case result |> Decode.decodeCsv Decode.FieldNamesFromFirstRow decodePlanetCsv of
                Ok cards ->
                    { model | cardList = updateCardList model.cardList cards, planetsDeckLoaded = True }
                        |> maybeGetDate

                Err err ->
                    ( model, Cmd.none )

        ParsePlanetCsv err ->
            ( model, Cmd.none )

        GetRandomCard today ->
            let
                randomCardId : Int
                randomCardId =
                    today
                        |> Time.startOfDay Time.utc
                        |> Time.toMillis Time.utc
                        |> Random.initialSeed
                        |> Random.step (Random.int 1 51)
                        |> Tuple.first

                selectedCard : Maybe Card
                selectedCard =
                    model.cardList
                        |> List.find (.id >> (==) randomCardId)
            in
            ( { model | selectedCard = selectedCard }
            , Cmd.none
            )


maybeGetDate : Model -> ( Model, Cmd Msg )
maybeGetDate model =
    if model.mainDeckLoaded && model.planetsDeckLoaded then
        ( model, Task.perform GetRandomCard Time.now )

    else
        ( model, Cmd.none )


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
    case model.selectedCard of
        Nothing ->
            text ""

        Just selectedCard ->
            div [ class "font-megrim flex justify-center" ]
                [ a [ href <| Card.cardLink selectedCard ]
                    [ img
                        [ class <|
                            "border-8 rounded-lg border-black shadow-md card "
                                ++ (case selectedCard.cardType of
                                        Card.System _ ->
                                            " horizontal"

                                        _ ->
                                            ""
                                   )
                        , src <| Card.cardImg selectedCard True
                        ]
                        []
                    ]
                ]


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
