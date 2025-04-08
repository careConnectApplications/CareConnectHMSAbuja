import { Box, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack, SimpleGrid, Select
} from '@chakra-ui/react'
import moment from "moment";
import PreviewCard from "./PreviewCard";


export default function PreviewEncounter({ isOpen, onClose, oldPayload }) {


    const [GeneralPhysicalExamination, setGeneralPhysicalExamination] = useState({
        title: "general physical examination",
        display: false,

    });
    const [PediatricSpecific, setPediatricSpecific] = useState({
        title: "pediatrics specific",
        display: false,

    });
    const [AssessmentDiagnosis, setAssessmentDiagnosis] = useState({
        title: "assessment & diagnosis ",
        display: false,

    });
    const [PhysicalCvs, setPhysicalCvs] = useState({
        title: "physical examination ~ CVS",
        display: false,

    });
    const [PhysicalResp, setPhysicalResp] = useState({
        title: "physical examination ~ RESP",
        display: false,

    });
    const [PhysicalGi, setPhysicalGi] = useState({
        title: "physical examination ~ GI",
        display: false,

    });
    const [PhysicalGu, setPhysicalGu] = useState({
        title: "physical examination ~ GU",
        display: false,

    });
    const [PhysicalNeuro, setPhysicalNeuro] = useState({
        title: "physical examination ~ NEURO",
        display: false,

    });
    const [PhysicalMsk, setPhysicalMsk] = useState({
        title: "physical examination ~ MSK",
        display: false,

    });
    const [History, setHistory] = useState({
        title: "history",
        display: false,

    });
    const [HistoryCvs, setHistoryCvs] = useState({
        title: "history ~ CVS",
        display: false,

    });
    const [HistoryResp, setHistoryResp] = useState({
        title: "history ~ RESP",
        display: false,

    });
    const [HistoryGi, setHistoryGi] = useState({
        title: "history ~ GI",
        display: false,

    });
    const [HistoryGu, setHistoryGu] = useState({
        title: "history ~ GU",
        display: false,

    });
    const [HistoryNeuro, setHistoryNeuro] = useState({
        title: "history ~ NEURO",
        display: false,

    });

    const [HistoryMsk, setHistoryMsk] = useState({
        title: "history ~ MSK",
        display: false,

    });
    const [MedicalHistory, setMedicalHistory] = useState({
        title: "Medical History",
        display: false,

    });
    const [PrenatalHistory, setPrenatalHistory] = useState({
        title: "Prenatal/Postnatal History",
        display: false,

    });
    const [DevelopmentalHistory, setDevelopmentalHistory] = useState({
        title: "Developmental History",
        display: false,

    });
    const [ImmunizationHistory, setImmunizationHistory] = useState({
        title: "Immunization History",
        display: false,

    });










    const BMI = parseInt(oldPayload.weight) / ((parseInt(oldPayload.height) / 100) * (parseInt(oldPayload.height) / 100))
    useEffect(() => {

        const historyPayload = {
            presentingcomplaints: oldPayload.presentingcomplaints,
            presentingcompalintcode: oldPayload.presentingcompalintcode,
            pastmedicalhistory: oldPayload.pastmedicalhistory,
            drugandallergyhistory: oldPayload.drugandallergyhistory,
            familyandsocialhistory: oldPayload.familyandsocialhistory,
            nutritionhistory: oldPayload.nutritionhistory,
            spirituality: oldPayload.spirituality
        }

        if (Object.values(historyPayload).some(value => value !== null && value !== "")) {
            setHistory({ ...History, display: true })
        } else {
            setHistory({ ...History, display: false })
        }

        const historyCvsPayload = {
            cvsassessmentimpression: oldPayload.historycvs?.cvsassessmentimpression,
            historyofcvsdisorder: oldPayload.historycvs?.historyofcvsdisorder,
            historyofcvssurgicalprocedures: oldPayload.historycvs?.historyofcvssurgicalprocedures,
            historycvsremark: oldPayload.historycvs?.historycvsremark
        }

        if (Object.values(historyCvsPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setHistoryCvs({ ...HistoryCvs, display: true })
        } else {
            setHistoryCvs({ ...HistoryCvs, display: false })
        }
        const historyRespPayload = {
            historyofrespiratorydisorders: oldPayload.historyresp?.historyofrespiratorydisorders,
            respremark: oldPayload.historyresp?.respremark,

        }

        if (Object.values(historyRespPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setHistoryResp({ ...HistoryResp, display: true })
        } else {
            setHistoryResp({ ...HistoryResp, display: false })
        }
        const historyGiPayload = {
            nausea: oldPayload.historygi?.nausea,
            typeofdiet: oldPayload.historygi?.typeofdiet,
            giboweleliminationpattern: oldPayload.historygi?.giboweleliminationpattern,
            bmfrequency: oldPayload.historygi?.bmfrequency,
            bmusualtimeoftheday: oldPayload.historygi?.bmusualtimeoftheday,
            bmregularity: oldPayload.historygi?.bmregularity,
            usualconsistency: oldPayload.historygi?.usualconsistency,
            dateoflastbm: oldPayload.historygi?.dateoflastbm,
            consistency: oldPayload.historygi?.consistency,
            color: oldPayload.historygi?.color,
            amount: oldPayload.historygi?.amount,
            appearance: oldPayload.historygi?.appearance,
            historyofgidisorders: oldPayload.historygi?.historyofgidisorders,
            historyofsurgicalprocedureofgisystem: oldPayload.historygi?.historyofsurgicalprocedureofgisystem,
            historygiremark: oldPayload.historygi?.historygiremark,

        }

        if (Object.values(historyGiPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setHistoryGi({ ...HistoryGi, display: true })
        } else {
            setHistoryGi({ ...HistoryGi, display: false })
        }

        const historyGuPayload = {
            historyofgenitourinarydisorders: oldPayload.historygu?.historyofgenitourinarydisorders,
            historyofsrgicalprocedureforgusyetm: oldPayload.historygu?.historyofsrgicalprocedureforgusyetm,
            numberstools: oldPayload.historygu?.numberstools,
            fluidoutputemesis: oldPayload.historygu?.fluidoutputemesis,
            guboweleliminationpattern: oldPayload.historygu?.guboweleliminationpattern,
            consistencystool: oldPayload.historygu?.consistencystool,
            historyguremark: oldPayload.historygu?.historyguremark,


        }

        if (Object.values(historyGuPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setHistoryGu({ ...HistoryGu, display: true })
        } else {
            setHistoryGu({ ...HistoryGu, display: false })
        }
        const historyNeuroPayload = {
            historyofneurologicdisorders: oldPayload.historyneuro?.historyofneurologicdisorders,
            historyofsurgicalproceduresofnervoussystem: oldPayload.historyneuro?.historyofsurgicalproceduresofnervoussystem,
            historyneuroremark: oldPayload.historyneuro?.historyneuroremark,


        }

        if (Object.values(historyNeuroPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setHistoryNeuro({ ...HistoryNeuro, display: true })
        } else {
            setHistoryNeuro({ ...HistoryNeuro, display: false })
        }
        const historyMskPayload = {
            historyofmusculoskeletaldisorders: oldPayload.historymsk?.historyofmusculoskeletaldisorders,
            historyofsurgicalproceduresofmsksystem: oldPayload.historymsk?.historyofsurgicalproceduresofmsksystem,
            historymskremarks: oldPayload.historymsk?.historymskremarks,


        }

        if (Object.values(historyMskPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setHistoryMsk({ ...HistoryMsk, display: true })
        } else {
            setHistoryMsk({ ...HistoryMsk, display: false })
        }

        const generalExaminationPayload = {
            hair: oldPayload.hair,
            hairnote: oldPayload.hairnote,
            face: oldPayload.face,
            facenote: oldPayload.facenote,
            jaundice: oldPayload.jaundice,
            jaundicenote: oldPayload.jaundicenote,
            cyanosis: oldPayload.cyanosis,
            cyanosisnote: oldPayload.cyanosisnote,
            pallor: oldPayload.pallor,
            pallornote: oldPayload.pallornote,
            oral: oldPayload.oral,
            oralnote: oldPayload.oralnote,
            lymphnodes: oldPayload.lymphnodes,
            lymphnodesnote: oldPayload.lymphnodesnote,
            ederma: oldPayload.ederma,
            edermanote: oldPayload.edermanote,
            lastmenstrationperiod: oldPayload.lastmenstrationperiod,
            lastmenstrationperiodnote: oldPayload.lastmenstrationperiodnote,
            generalphysicalexamination: oldPayload.generalphysicalexamination,
        }

        if (Object.values(generalExaminationPayload).some(value => value !== null && value !== "")) {
            setGeneralPhysicalExamination({ ...GeneralPhysicalExamination, display: true })
        } else {
            setGeneralPhysicalExamination({ ...GeneralPhysicalExamination, display: false })
        }
        const pediatricsPayload = {
            reflexes: oldPayload.paediatricsspecific?.reflexes,
            rootingreflexes: oldPayload.paediatricsspecific?.rootingreflexes,
            suckreflexes: oldPayload.paediatricsspecific?.suckreflexes,
            mororeflexes: oldPayload.paediatricsspecific?.mororeflexes,
            tonicneckreflexes: oldPayload.paediatricsspecific?.tonicneckreflexes,
            graspreflexes: oldPayload.paediatricsspecific?.graspreflexes,
            steppingreflexes: oldPayload.paediatricsspecific?.steppingreflexes,
            currentlengthheight: oldPayload.paediatricsspecific?.currentlengthheight,
            currentlengthheightpercentage: oldPayload.paediatricsspecific?.currentlengthheightpercentage,
            currentlengthheightenote: oldPayload.paediatricsspecific?.currentlengthheightenote,
            currentweight: oldPayload.paediatricsspecific?.currentweight,
            currentweightnote: oldPayload.paediatricsspecific?.currentweightnote,
            percentageofweightexpected: oldPayload.paediatricsspecific?.percentageofweightexpected,
            headcircumference: oldPayload.paediatricsspecific?.headcircumference,
            anteriorfontanelle: oldPayload.paediatricsspecific?.anteriorfontanelle,
            posteriorfontanelle: oldPayload.paediatricsspecific?.posteriorfontanelle,
            chestcircumference: oldPayload.paediatricsspecific?.chestcircumference,
            limbexamination: oldPayload.paediatricsspecific?.limbexamination,
            generalnote: oldPayload.paediatricsspecific?.generalnote,
            neuronote: oldPayload.paediatricsspecific?.neuronote,

        }


        if (Object.values(pediatricsPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPediatricSpecific({ ...PediatricSpecific, display: true })
        } else {
            setPediatricSpecific({ ...PediatricSpecific, display: false })
        }

        const AssessmentPayload = {

            assessment: oldPayload.assessment,
            assessmentnote: oldPayload.assessmentnote,
            diagosis: oldPayload.diagosis,
            diagosisnote: oldPayload.diagosisnote,
            icpc2: oldPayload.icpc2,
            icpc2note: oldPayload.icpc2note,

        }

        if (Object.values(AssessmentPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setAssessmentDiagnosis({ ...AssessmentDiagnosis, display: true })
        } else {
            setAssessmentDiagnosis({ ...AssessmentDiagnosis, display: false })
        }
        const MedicalHistoryPayload = {

            attentiondeficitdisorderhyperactivitydisordernote: oldPayload.medicalhistory?.attentiondeficitdisorderhyperactivitydisordernote,
            constipationnote: oldPayload.medicalhistory?.constipationnote,
            fatiguenote: oldPayload.medicalhistory?.fatiguenote,
            orthopedicconditionsnote: oldPayload.medicalhistory?.orthopedicconditionsnote,
            allergiesnote: oldPayload.medicalhistory?.allergiesnote,
            diabetesnote: oldPayload.medicalhistory?.diabetesnote,
            headachesnote: oldPayload.medicalhistory?.headachesnote,
            scoliosisnote: oldPayload.medicalhistory?.scoliosisnote,
            asthmanote: oldPayload.medicalhistory?.asthmanote,
            digestiveproblemsnote: oldPayload.medicalhistory?.digestiveproblemsnote,
            hearingdifficultiesnote: oldPayload.medicalhistory?.hearingdifficultiesnote,
            seizuresnote: oldPayload.medicalhistory?.seizuresnote,
            blooddisordernote: oldPayload.medicalhistory?.blooddisordernote,
            depressionanxietynote: oldPayload.medicalhistory?.depressionanxietynote,
            heartproblemsnote: oldPayload.medicalhistory?.heartproblemsnote,
            sleepdisturbancesnote: oldPayload.medicalhistory?.sleepdisturbancesnote,
            chroniccoldsnote: oldPayload.medicalhistory?.chroniccoldsnote,
            dyslexianote: oldPayload.medicalhistory?.dyslexianote,
            kidneydisordersnote: oldPayload.medicalhistory?.kidneydisordersnote,
            torticollisnote: oldPayload.medicalhistory?.torticollisnote,
            colicnote: oldPayload.medicalhistory?.colicnote,
            earinfectionsnote: oldPayload.medicalhistory?.earinfectionsnote,
            lymphdisordersnote: oldPayload.medicalhistory?.lymphdisordersnote,
            visiondifficultiesnote: oldPayload.medicalhistory?.visiondifficultiesnote,
            autismnote: oldPayload.medicalhistory?.autismnote,
            sensoryprocessingchallengesnote: oldPayload.medicalhistory?.sensoryprocessingchallengesnote,
            attentiondeficitdisorderhyperactivitydisorder: oldPayload.medicalhistory?.attentiondeficitdisorderhyperactivitydisorder,
            constipation: oldPayload.medicalhistory?.constipation,
            fatigue: oldPayload.medicalhistory?.fatigue,
            orthopedicconditions: oldPayload.medicalhistory?.orthopedicconditions,
            allergies: oldPayload.medicalhistory?.allergies,
            diabetes: oldPayload.medicalhistory?.diabetes,
            headaches: oldPayload.medicalhistory?.headaches,
            scoliosis: oldPayload.medicalhistory?.scoliosis,
            asthma: oldPayload.medicalhistory?.asthma,
            digestiveproblems: oldPayload.medicalhistory?.digestiveproblems,
            hearingdifficulties: oldPayload.medicalhistory?.hearingdifficulties,
            seizures: oldPayload.medicalhistory?.seizures,
            blooddisorder: oldPayload.medicalhistory?.blooddisorder,
            depressionanxiety: oldPayload.medicalhistory?.depressionanxiety,
            heartproblems: oldPayload.medicalhistory?.heartproblems,
            sleepdisturbances: oldPayload.medicalhistory?.sleepdisturbances,
            chroniccolds: oldPayload.medicalhistory?.chroniccolds,
            dyslexia: oldPayload.medicalhistory?.dyslexia,
            kidneydisorders: oldPayload.medicalhistory?.kidneydisorders,
            torticollis: oldPayload.medicalhistory?.torticollis,
            colic: oldPayload.medicalhistory?.colic,
            earinfections: oldPayload.medicalhistory?.earinfections,
            lymphdisorders: oldPayload.medicalhistory?.lymphdisorders,
            visiondifficulties: oldPayload.medicalhistory?.visiondifficulties,
            autism: oldPayload.medicalhistory?.autism,
            sensoryprocessingchallenges: oldPayload.medicalhistory?.sensoryprocessingchallenges,

        }

        if (Object.values(MedicalHistoryPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setMedicalHistory({ ...MedicalHistory, display: true })
        } else {
            setMedicalHistory({ ...MedicalHistory, display: false })
        }

        const PrenatalHistoryPayload = {

            stressorsnote: oldPayload.prepostnatalhistory?.stressorsnote,
            pregnancymedicationnote: oldPayload.prepostnatalhistory?.pregnancymedicationnote,
            cigarettealcoholusenote: oldPayload.prepostnatalhistory?.cigarettealcoholusenote,
            deliverynote: oldPayload.prepostnatalhistory?.deliverynote,
            deliverytypenote: oldPayload.prepostnatalhistory?.deliverytypenote,
            emergencydeliverynote: oldPayload.prepostnatalhistory?.emergencydeliverynote,
            labourinductionnote: oldPayload.prepostnatalhistory?.labourinductionnote,
            birthhistorymedicationnote: oldPayload.prepostnatalhistory?.birthhistorymedicationnote,
            assisteddeliverynote: oldPayload.prepostnatalhistory?.assisteddeliverynote,
            typeofassisteddeliverynote: oldPayload.prepostnatalhistory?.typeofassisteddeliverynote,
            complicationsduringdeliverynote: oldPayload.prepostnatalhistory?.complicationsduringdeliverynote,
            birthweight: oldPayload.prepostnatalhistory?.birthweight,
            birthlengthheight: oldPayload.prepostnatalhistory?.birthlengthheight,
            feedingofthechildnote: oldPayload.prepostnatalhistory?.feedingofthechildnote,
            difficultyinlatchingsuckingnote: oldPayload.prepostnatalhistory?.difficultyinlatchingsuckingnote,
            stressors: oldPayload.prepostnatalhistory?.stressors,
            pregnancymedication: oldPayload.prepostnatalhistory?.pregnancymedication,
            cigarettealcoholuse: oldPayload.prepostnatalhistory?.cigarettealcoholuse,
            delivery: oldPayload.prepostnatalhistory?.delivery,
            deliverytype: oldPayload.prepostnatalhistory?.deliverytype,
            emergencydelivery: oldPayload.prepostnatalhistory?.emergencydelivery,
            labourinduction: oldPayload.prepostnatalhistory?.labourinduction,
            birthhistorymedication: oldPayload.prepostnatalhistory?.birthhistorymedication,
            assisteddelivery: oldPayload.prepostnatalhistory?.assisteddelivery,
            typeofassisteddelivery: oldPayload.prepostnatalhistory?.typeofassisteddelivery,
            complicationsduringdelivery: oldPayload.prepostnatalhistory?.complicationsduringdelivery,
            apgarscoreafteroneminute: oldPayload.prepostnatalhistory?.apgarscoreafteroneminute,
            apgarscoreafterfiveminutes: oldPayload.prepostnatalhistory?.apgarscoreafterfiveminutes,
            useofoxygenafterbirth: oldPayload.prepostnatalhistory?.useofoxygenafterbirth,
            feedingofthechild: oldPayload.prepostnatalhistory?.feedingofthechild,
            difficultyinlatchingsucking: oldPayload.prepostnatalhistory?.difficultyinlatchingsucking,

        }

        if (Object.values(PrenatalHistoryPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPrenatalHistory({ ...PrenatalHistory, display: true })
        } else {
            setPrenatalHistory({ ...PrenatalHistory, display: false })
        }
        const DevelopmentalHistoryPayload = {

            agewhenrolledover: oldPayload.developmentmilestonehistorydetails?.agewhenrolledover,
            satupunsupported: oldPayload.developmentmilestonehistorydetails?.satupunsupported,
            crawled: oldPayload.developmentmilestonehistorydetails?.crawled,
            walked: oldPayload.developmentmilestonehistorydetails?.walked,
            spokefirstword: oldPayload.developmentmilestonehistorydetails?.spokefirstword,
            spokeinsentences: oldPayload.developmentmilestonehistorydetails?.spokeinsentences,
            totaltrianed: oldPayload.developmentmilestonehistorydetails?.totaltrianed,
            anyfoodallergiesnote: oldPayload.developmentmilestonehistorydetails?.anyfoodallergiesnote,
            contacttypesportnote: oldPayload.developmentmilestonehistorydetails?.contacttypesportnote,
            historyofcaraccidentnote: oldPayload.developmentmilestonehistorydetails?.historyofcaraccidentnote,
            everbeenseenonemergencynote: oldPayload.developmentmilestonehistorydetails?.everbeenseenonemergencynote,
            otherhistoryoftraumanote: oldPayload.developmentmilestonehistorydetails?.otherhistoryoftraumanote,
            historyoffrequentfallsnote: oldPayload.developmentmilestonehistorydetails?.historyoffrequentfallsnote,
            anysignofmuscleweaknessnote: oldPayload.developmentmilestonehistorydetails?.anysignofmuscleweaknessnote,
            anyfoodallergies: oldPayload.developmentmilestonehistorydetails?.anyfoodallergies,
            contacttypesport: oldPayload.developmentmilestonehistorydetails?.contacttypesport,
            historyofcaraccident: oldPayload.developmentmilestonehistorydetails?.historyofcaraccident,
            everbeenseenonemergency: oldPayload.developmentmilestonehistorydetails?.everbeenseenonemergency,
            otherhistoryoftrauma: oldPayload.developmentmilestonehistorydetails?.otherhistoryoftrauma,
            historyoffrequentfalls: oldPayload.developmentmilestonehistorydetails?.historyoffrequentfalls,
            anysignofmuscleweakness: oldPayload.developmentmilestonehistorydetails?.anysignofmuscleweakness,
        }

        if (Object.values(DevelopmentalHistoryPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setDevelopmentalHistory({ ...DevelopmentalHistory, display: true })
        } else {
            setDevelopmentalHistory({ ...DevelopmentalHistory, display: false })
        }
        const ImmunizationHistoryPayload = {
            immunization: oldPayload.immunizationhistory?.immunization,
            hepb0: oldPayload.immunizationhistory?.hepb0,
            opv0: oldPayload.immunizationhistory?.opv0,
            bcg: oldPayload.immunizationhistory?.bcg,
            opv1: oldPayload.immunizationhistory?.opv1,
            penta1: oldPayload.immunizationhistory?.penta1,
            pcv1: oldPayload.immunizationhistory?.pcv1,
            rota1: oldPayload.immunizationhistory?.rota1,
            opv2: oldPayload.immunizationhistory?.opv2,
            pcv2: oldPayload.immunizationhistory?.pcv2,
            rota2: oldPayload.immunizationhistory?.rota2,
            opv3: oldPayload.immunizationhistory?.opv3,
            penta3: oldPayload.immunizationhistory?.penta3,
            pcv3: oldPayload.immunizationhistory?.pcv3,
            rota3: oldPayload.immunizationhistory?.rota3,
            ipv: oldPayload.immunizationhistory?.ipv,
            vitamina1: oldPayload.immunizationhistory?.vitamina1,
            vitamina2: oldPayload.immunizationhistory?.vitamina2,
            measles: oldPayload.immunizationhistory?.measles,
            yellowfever: oldPayload.immunizationhistory?.yellowfever,
            mena: oldPayload.immunizationhistory?.mena,
            measles2: oldPayload.immunizationhistory?.measles2,
            hpv914: oldPayload.immunizationhistory?.hpv914,
            llin: oldPayload.immunizationhistory?.llin
        }

        if (Object.values(ImmunizationHistoryPayload).some(value => value !== null && value !== "" && value !== undefined && value !== false)) {
            setImmunizationHistory({ ...ImmunizationHistory, display: true })
        } else {
            setImmunizationHistory({ ...ImmunizationHistory, display: false })
        }
        const PhysicalCvsPayload = {

            heartrate: oldPayload.cvs?.heartrate,
            bpsystolic: oldPayload.cvs?.heartrate,
            bpdiastolic: oldPayload.cvs?.heartrate,
            capillaryrefilltime: oldPayload.cvs?.heartrate,
            heartraterhythm: oldPayload.cvs?.heartrate,
            heartsound: oldPayload.cvs?.heartrate,
            heartmurmurgrade: oldPayload.cvs?.heartrate,
            heartmurmurquality: oldPayload.cvs?.heartrate,
            heartmurmurpitch: oldPayload.cvs?.heartrate,
            heartmurmurtiming: oldPayload.cvs?.heartrate,
            murmurlocationauscultation: oldPayload.cvs?.heartrate,
            murmurradiatingtobodylocation: oldPayload.cvs?.heartrate,
            jugularveindistention: oldPayload.cvs?.heartrate,
            jugularveindistentionheadup30degree: oldPayload.cvs?.heartrate,
            edema: oldPayload.cvs?.heartrate,
            temperatureextrmities: oldPayload.cvs?.heartrate,
            tissueperfusionassessmentimpression: oldPayload.cvs?.heartrate,
            cvsremark: oldPayload.cvs?.heartrate

        }

        if (Object.values(PhysicalCvsPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPhysicalCvs({ ...PhysicalCvs, display: true })
        } else {
            setPhysicalCvs({ ...PhysicalCvs, display: false })
        }
        const PhysicalRespPayload = {

            respiratoryrhthm: oldPayload.resp?.respiratoryrhthm,
            respiratoryrate: oldPayload.resp?.respiratoryrate,
            respiratoryeffort: oldPayload.resp?.respiratoryeffort,
            breathsoundsauscultation: oldPayload.resp?.breathsoundsauscultation,
            localizedbreathsounds: oldPayload.resp?.localizedbreathsounds,
            respiratoryassessmentimpression: oldPayload.resp?.respiratoryassessmentimpression,
            respremarks: oldPayload.resp?.respremarks

        }

        if (Object.values(PhysicalRespPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPhysicalResp({ ...PhysicalResp, display: true })
        } else {
            setPhysicalResp({ ...PhysicalResp, display: false })
        }
        const PhysicalGiPayload = {

            bowelsoundauscultation: oldPayload.gi?.bowelsoundauscultation,
            bowelsoundbyqualityauscultation: oldPayload.gi?.bowelsoundbyqualityauscultation,
            bsquadauscultation: oldPayload.gi?.bsquadauscultation,
            physiologicfindingbypalpation: oldPayload.gi?.physiologicfindingbypalpation,
            giassessmentimpression: oldPayload.gi?.giassessmentimpression,
            giremarks: oldPayload.gi?.giremarks,

        }

        if (Object.values(PhysicalGiPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPhysicalGi({ ...PhysicalGi, display: true })
        } else {
            setPhysicalGi({ ...PhysicalGi, display: false })
        }

        const PhysicalGuPayload = {

            urinecolor: oldPayload.gu?.urinecolor,
            urineodor: oldPayload.gu?.urineodor,
            urineturbidity: oldPayload.gu?.urineturbidity,
            urinecollectiondevice: oldPayload.gu?.urinecollectiondevice,
            voidingpattern: oldPayload.gu?.voidingpattern,
            appearanceurine: oldPayload.gu?.appearanceurine,
            otherurine: oldPayload.gu?.otherurine,
            genitourinaryassessmentimpression: oldPayload.gu?.genitourinaryassessmentimpression,
            numbervoids: oldPayload.gu?.numbervoids,
            incontinentvoidsurinary: oldPayload.gu?.incontinentvoidsurinary,
            diapercount: oldPayload.gu?.diapercount,
            perinealpadscount: oldPayload.gu?.perinealpadscount,
            colorurine: oldPayload.gu?.colorurine,
            voidingpatterngu: oldPayload.gu?.voidingpatterngu,
            bloodlossvolume: oldPayload.gu?.bloodlossvolume,
            genitouringassessmentimpressions: oldPayload.gu?.genitouringassessmentimpressions,
            guremark: oldPayload.gu?.guremark

        }

        if (Object.values(PhysicalGuPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPhysicalGu({ ...PhysicalGu, display: true })
        } else {
            setPhysicalGu({ ...PhysicalGu, display: false })
        }

        const PhysicalNeuroPayload = {

            levelofconsciousness: oldPayload.neuro?.levelofconsciousness,
            person: oldPayload.neuro?.person,
            place: oldPayload.neuro?.place,
            time: oldPayload.neuro?.time,
            orientationassessmentimpression: oldPayload.neuro?.orientationassessmentimpression,
            levelofarousal: oldPayload.neuro?.levelofarousal,
            speechclarity: oldPayload.neuro?.speechclarity,
            patientmood: oldPayload.neuro?.patientmood,
            patientmemory: oldPayload.neuro?.patientmemory,
            abilitytoconcentrate: oldPayload.neuro?.abilitytoconcentrate,
            abilitytodirectattention: oldPayload.neuro?.abilitytodirectattention,
            cniexam: oldPayload.neuro?.cniexam,
            cniiexam: oldPayload.neuro?.cniiexam,
            cniiiexam: oldPayload.neuro?.cniiiexam,
            cnivexam: oldPayload.neuro?.cnivexam,
            cnvexam: oldPayload.neuro?.cnvexam,
            cnviexam: oldPayload.neuro?.cnviexam,
            cniviiexam: oldPayload.neuro?.cniviiexam,
            cniviiiexam: oldPayload.neuro?.cniviiiexam,
            cnixexam: oldPayload.neuro?.cnixexam,
            cnxexam: oldPayload.neuro?.cnxexam,
            cnxiexam: oldPayload.neuro?.cnxiexam,
            cnxiiexam: oldPayload.neuro?.cnxiiexam,
            pupildiametereyer: oldPayload.neuro?.pupildiametereyer,
            pupildiametereyel: oldPayload.neuro?.pupildiametereyel,
            pupillaryresponsepupilr: oldPayload.neuro?.pupillaryresponsepupilr,
            pupillaryresponsepupill: oldPayload.neuro?.pupillaryresponsepupill,
            pupilshaperightpupil: oldPayload.neuro?.pupilshaperightpupil,
            pupilshapeleftpupil: oldPayload.neuro?.pupilshapeleftpupil,
            pupilassessmentimpression: oldPayload.neuro?.pupilassessmentimpression,
            physiologicfindingopticlens: oldPayload.neuro?.physiologicfindingopticlens,
            glasgowcomascale: oldPayload.neuro?.glasgowcomascale,
            neurologyassessmentimpression: oldPayload.neuro?.neurologyassessmentimpression,
            nueroremarks: oldPayload.neuro?.nueroremarks,

        }

        if (Object.values(PhysicalNeuroPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPhysicalNeuro({ ...PhysicalNeuro, display: true })
        } else {
            setPhysicalNeuro({ ...PhysicalNeuro, display: false })
        }

        const PhysicalMskPayload = {

            muscletone: oldPayload.msk?.muscletone,
            musclestrength: oldPayload.msk?.musclestrength,
            involuntarymovements: oldPayload.msk?.involuntarymovements,
            activerangeflexionshoulderl: oldPayload.msk?.activerangeflexionshoulderl,
            activerangeextensionshoulderl: oldPayload.msk?.activerangeextensionshoulderl,
            activerangeexternalrotationshoulderl: oldPayload.msk?.activerangeexternalrotationshoulderl,
            activerangeinternalrotationshoulderl: oldPayload.msk?.activerangeinternalrotationshoulderl,
            activerangeabductionshoulderl: oldPayload.msk?.activerangeabductionshoulderl,
            activerangeadductionshoulderl: oldPayload.msk?.activerangeadductionshoulderl,
            activerangeflexionshoulderr: oldPayload.msk?.activerangeflexionshoulderr,
            activerangeextensionshoulderr: oldPayload.msk?.activerangeextensionshoulderr,
            activerangeexternalrotationshoulderr: oldPayload.msk?.activerangeexternalrotationshoulderr,
            activerangeinternalrotationshoulderr: oldPayload.msk?.activerangeinternalrotationshoulderr,
            activerangeabductionshoulderr: oldPayload.msk?.activerangeabductionshoulderr,
            activerangeadductionshoulderr: oldPayload.msk?.activerangeadductionshoulderr,
            activerangeflexionelbowl: oldPayload.msk?.activerangeflexionelbowl,
            activerangeextensionelbowl: oldPayload.msk?.activerangeextensionelbowl,
            activerangeflexionelbowr: oldPayload.msk?.activerangeflexionelbowr,
            activerangeextensionelbowr: oldPayload.msk?.activerangeextensionelbowr,
            activerangeflexionhipl: oldPayload.msk?.activerangeflexionhipl,
            activerangeextensionhipl: oldPayload.msk?.activerangeextensionhipl,
            activerangeexternalrotationhipl: oldPayload.msk?.activerangeexternalrotationhipl,
            activerangeinternalrotationhipl: oldPayload.msk?.activerangeinternalrotationhipl,
            activerangeabductionhipl: oldPayload.msk?.activerangeabductionhipl,
            activerangeadductionhipl: oldPayload.msk?.activerangeadductionhipl,
            activerangeflexionhipr: oldPayload.msk?.activerangeflexionhipr,
            activerangeextensionhipr: oldPayload.msk?.activerangeextensionhipr,
            activerangeexternalrotationhipr: oldPayload.msk?.activerangeexternalrotationhipr,
            activerangeinternalrotationhipr: oldPayload.msk?.activerangeinternalrotationhipr,
            activerangeabductionhipr: oldPayload.msk?.activerangeabductionhipr,
            activerangeadductionhipr: oldPayload.msk?.activerangeadductionhipr,
            activerangeflexionkneel: oldPayload.msk?.activerangeflexionkneel,
            activerangeextensionkneel: oldPayload.msk?.activerangeextensionkneel,
            activerangeflexionkneer: oldPayload.msk?.activerangeflexionkneer,
            activerangeextensionkneer: oldPayload.msk?.activerangeextensionkneer,
            passiverangeflexionshoulderl: oldPayload.msk?.passiverangeflexionshoulderl,
            passiverangeextensionshoulderl: oldPayload.msk?.passiverangeextensionshoulderl,
            passiverangeexternalrotationshoulderl: oldPayload.msk?.passiverangeexternalrotationshoulderl,
            passiverangeinternalrotationshoulderl: oldPayload.msk?.passiverangeinternalrotationshoulderl,
            passiverangeabductionshoulderl: oldPayload.msk?.passiverangeabductionshoulderl,
            passiverangeadductionshoulderl: oldPayload.msk?.passiverangeadductionshoulderl,
            passiverangeflexionshoulderr: oldPayload.msk?.passiverangeflexionshoulderr,
            passiverangeextensionshoulderr: oldPayload.msk?.passiverangeextensionshoulderr,
            passiverangeexternalrotationshoulderr: oldPayload.msk?.passiverangeexternalrotationshoulderr,
            passiverangeinternalrotationshoulderr: oldPayload.msk?.passiverangeinternalrotationshoulderr,
            passiverangeabductionshoulderr: oldPayload.msk?.passiverangeabductionshoulderr,
            passiverangeadductionshoulderr: oldPayload.msk?.passiverangeadductionshoulderr,
            passiverangeflexionelbowl: oldPayload.msk?.passiverangeflexionelbowl,
            passiverangeextensionelbowl: oldPayload.msk?.passiverangeextensionelbowl,
            passiverangeflexionelbowr: oldPayload.msk?.passiverangeflexionelbowr,
            passiverangeextensionelbowr: oldPayload.msk?.passiverangeextensionelbowr,
            passiverangeflexionhipl: oldPayload.msk?.passiverangeflexionhipl,
            passiverangeextensionhipl: oldPayload.msk?.passiverangeextensionhipl,
            passiverangeexternalrotationhipl: oldPayload.msk?.passiverangeexternalrotationhipl,
            passiverangeinternalrotationhipl: oldPayload.msk?.passiverangeinternalrotationhipl,
            passiverangeabductionhipl: oldPayload.msk?.passiverangeabductionhipl,
            passiverangeadductionhipl: oldPayload.msk?.passiverangeadductionhipl,
            passiverangeflexionhipr: oldPayload.msk?.passiverangeflexionhipr,
            passiverangeextensionhipr: oldPayload.msk?.passiverangeextensionhipr,
            passiverangeexternalrotationhipr: oldPayload.msk?.passiverangeexternalrotationhipr,
            passiverangeinternalrotationhipr: oldPayload.msk?.passiverangeinternalrotationhipr,
            passiverangeabductionhipr: oldPayload.msk?.passiverangeabductionhipr,
            passiverangeadductionhipr: oldPayload.msk?.passiverangeadductionhipr,
            passiverangeflexionkneel: oldPayload.msk?.passiverangeflexionkneel,
            passiverangeextensionkneel: oldPayload.msk?.passiverangeextensionkneel,
            passiverangeflexionkneer: oldPayload.msk?.passiverangeflexionkneer,
            passiverangeextensionkneer: oldPayload.msk?.passiverangeextensionkneer,
            dtrachilles: oldPayload.msk?.dtrachilles,
            dtrbiceps: oldPayload.msk?.dtrbiceps,
            dtrbrachioradialis: oldPayload.msk?.dtrbrachioradialis,
            dtrpatellar: oldPayload.msk?.dtrpatellar,
            dtrtriceps: oldPayload.msk?.dtrtriceps,
            babinskisreflex: oldPayload.msk?.babinskisreflex,
            oculocephalic: oldPayload.msk?.oculocephalic,
            paralysistype: oldPayload.msk?.paralysistype,
            paresthesiatype: oldPayload.msk?.paresthesiatype,
            physiologicfinding: oldPayload.msk?.physiologicfinding,
            musculoskeletalassessmentimpression: oldPayload.msk?.musculoskeletalassessmentimpression,
            mskremark: oldPayload.msk?.mskremark

        }

        if (Object.values(PhysicalMskPayload).some(value => value !== null && value !== "" && value !== undefined)) {
            setPhysicalMsk({ ...PhysicalMsk, display: true })
        } else {
            setPhysicalMsk({ ...PhysicalMsk, display: false })
        }



    }, [oldPayload, isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Preview Encounter Data </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">vital</Text>

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <PreviewCard title="vital date" value={moment(Date.now()).format("ll")} />
                        <PreviewCard title="height" value={oldPayload.height} />
                        <PreviewCard title="weight" value={oldPayload.weight} />
                        <PreviewCard title="temperature" value={oldPayload.temperature} />
                        <PreviewCard title="Blood Pressure Systolic" value={oldPayload.bloodpressuresystolic} />
                        <PreviewCard title="Blood Pressure Diastolic" value={oldPayload.bloodpressurediastolic} />
                        <PreviewCard title="Heart Rate" value={oldPayload.heart} />
                        <PreviewCard title="O2 Saturation" value={oldPayload.saturation} />
                        <PreviewCard title="respiration" value={oldPayload.respiration} />
                        <PreviewCard title="bmi" value={oldPayload.height !== "" && oldPayload.weight !== "" ? BMI.toFixed(2) : ""} />
                    </SimpleGrid>

                    {
                        History.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{History.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="presenting complaints" value={oldPayload.presentingcomplaints} />
                                    <PreviewCard title="presenting compalintcode" value={oldPayload.presentingcompalintcode} />
                                    <PreviewCard title="past medical history" value={oldPayload.pastmedicalhistory} />
                                    <PreviewCard title="drug and allergy history" value={oldPayload.drugandallergyhistory} />
                                    <PreviewCard title="family and social history" value={oldPayload.familyandsocialhistory} />
                                    <PreviewCard title="nutrition history" value={oldPayload.nutritionhistory} />
                                    <PreviewCard title="spirituality" value={oldPayload.spirituality} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HistoryCvs.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HistoryCvs.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="cvs assessment impression" value={oldPayload.historycvs?.cvsassessmentimpression} />
                                    <PreviewCard title="history of cvs disorder" value={oldPayload.historycvs?.historyofcvsdisorder} />
                                    <PreviewCard title="history of cvs surgical procedures" value={oldPayload.historycvs?.historyofcvssurgicalprocedures} />
                                    <PreviewCard title="histor cvs remark" value={oldPayload.historycvs?.historycvsremark} />


                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HistoryResp.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HistoryResp.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="history of respiratory disorders" value={oldPayload.historyresp?.historyofrespiratorydisorders} />
                                    <PreviewCard title="resp remark" value={oldPayload.historyresp?.respremark} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HistoryGi.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HistoryGi.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="nausea" value={oldPayload.historygi?.nausea} />
                                    <PreviewCard title="type of diet" value={oldPayload.historygi?.typeofdiet} />
                                    <PreviewCard title="gi bowel elimination pattern" value={oldPayload.historygi?.giboweleliminationpattern} />
                                    <PreviewCard title="bm frequency" value={oldPayload.historygi?.bmfrequency} />
                                    <PreviewCard title="bm usual time of the day" value={oldPayload.historygi?.bmusualtimeoftheday} />
                                    <PreviewCard title="bm regularity" value={oldPayload.historygi?.bmregularity} />
                                    <PreviewCard title="usual consistency" value={oldPayload.historygi?.usualconsistency} />
                                    <PreviewCard title="date of last bm" value={oldPayload.historygi?.dateoflastbm} />
                                    <PreviewCard title="consistency" value={oldPayload.historygi?.consistency} />
                                    <PreviewCard title="color" value={oldPayload.historygi?.color} />
                                    <PreviewCard title="amount" value={oldPayload.historygi?.amount} />
                                    <PreviewCard title="appearance" value={oldPayload.historygi?.appearance} />
                                    <PreviewCard title="history of gi disorders" value={oldPayload.historygi?.historyofgidisorders} />
                                    <PreviewCard title="history of surgical procedure of gi system" value={oldPayload.historygi?.historyofsurgicalprocedureofgisystem} />
                                    <PreviewCard title="history gi remark" value={oldPayload.historygi?.historygiremark} />


                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HistoryGu.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HistoryGu.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="history of genitourinary disorders" value={oldPayload.historygu?.historyofgenitourinarydisorders} />
                                    <PreviewCard title="history of surgical procedure for gu system" value={oldPayload.historygu?.historyofsrgicalprocedureforgusyetm} />
                                    <PreviewCard title="number stools" value={oldPayload.historygu?.numberstools} />
                                    <PreviewCard title="fluid output emesis" value={oldPayload.historygu?.fluidoutputemesis} />
                                    <PreviewCard title="gu bowel elimination pattern" value={oldPayload.historygu?.guboweleliminationpattern} />
                                    <PreviewCard title="consistency stool" value={oldPayload.historygu?.consistencystool} />
                                    <PreviewCard title="history gu remark" value={oldPayload.historygu?.historyguremark} />



                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HistoryNeuro.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HistoryNeuro.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="history of neurologic disorders" value={oldPayload.historyneuro?.historyofneurologicdisorders} />
                                    <PreviewCard title="history of surgical procedures of nervous system" value={oldPayload.historyneuro?.historyofsurgicalproceduresofnervoussystem} />
                                    <PreviewCard title="history neuro remark" value={oldPayload.historyneuro?.historyneuroremark} />



                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HistoryMsk.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HistoryMsk.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="history of musculo skeletal disorders" value={oldPayload.historymsk?.historyofmusculoskeletaldisorders} />
                                    <PreviewCard title="history of surgical procedures of msk system" value={oldPayload.historymsk?.historyofsurgicalproceduresofmsksystem} />
                                    <PreviewCard title="history msk remarks" value={oldPayload.historymsk?.historymskremarks} />



                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        GeneralPhysicalExamination.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{GeneralPhysicalExamination.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="hair" value={oldPayload.hair} />
                                    <PreviewCard title="hair note" value={oldPayload.hairnote} />
                                    <PreviewCard title="face" value={oldPayload.face} />
                                    <PreviewCard title="face note" value={oldPayload.facenote} />
                                    <PreviewCard title="jaundice" value={oldPayload.jaundice} />
                                    <PreviewCard title="jaundice note" value={oldPayload.jaundicenote} />
                                    <PreviewCard title="cyanosis" value={oldPayload.cyanosis} />
                                    <PreviewCard title="cyanosis note" value={oldPayload.cyanosisnote} />
                                    <PreviewCard title="pallor" value={oldPayload.pallor} />
                                    <PreviewCard title="pallor note" value={oldPayload.pallornote} />
                                    <PreviewCard title="oral" value={oldPayload.oral} />
                                    <PreviewCard title="oral note" value={oldPayload.oralnote} />
                                    <PreviewCard title="lymphnodes" value={oldPayload.lymphnodes} />
                                    <PreviewCard title="lymphnodes note" value={oldPayload.lymphnodesnote} />
                                    <PreviewCard title="ederma" value={oldPayload.ederma} />
                                    <PreviewCard title="ederma note" value={oldPayload.edermanote} />
                                    <PreviewCard title="last menstration period" value={oldPayload.lastmenstrationperiod} />
                                    <PreviewCard title="last menstration period note" value={oldPayload.lastmenstrationperiodnote} />
                                    <PreviewCard title="general physical examination" value={oldPayload.generalphysicalexamination} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PediatricSpecific.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PediatricSpecific.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="current length height" value={oldPayload.paediatricsspecific?.currentlengthheight} />
                                    <PreviewCard title="current length height percentage" value={oldPayload.paediatricsspecific?.currentlengthheightpercentage} />
                                    <PreviewCard title="current length height note" value={oldPayload.paediatricsspecific?.currentlengthheightenote} />
                                    <PreviewCard title="current weight" value={oldPayload.paediatricsspecific?.currentweight} />
                                    <PreviewCard title="current weight note" value={oldPayload.paediatricsspecific?.currentweightnote} />
                                    <PreviewCard title="percentage of weight expected" value={oldPayload.paediatricsspecific?.percentageofweightexpected} />
                                    <PreviewCard title="head circumference" value={oldPayload.paediatricsspecific?.headcircumference} />
                                    <PreviewCard title="anterior fontanelle" value={oldPayload.paediatricsspecific?.anteriorfontanelle} />
                                    <PreviewCard title="posterior fontanelle" value={oldPayload.paediatricsspecific?.posteriorfontanelle} />
                                    <PreviewCard title="chest circumference" value={oldPayload.paediatricsspecific?.chestcircumference} />
                                    <PreviewCard title="limb examination" value={oldPayload.paediatricsspecific?.limbexamination} />
                                    <PreviewCard title="general note" value={oldPayload.paediatricsspecific?.generalnote} />
                                    <PreviewCard title="neuro note" value={oldPayload.paediatricsspecific?.neuronote} />
                                    <PreviewCard title="reflexes" value={oldPayload.paediatricsspecific?.reflexes} />
                                    <PreviewCard title="rootingreflexes" value={oldPayload.paediatricsspecific?.rootingreflexes} />
                                    <PreviewCard title="suckreflexes" value={oldPayload.paediatricsspecific?.suckreflexes} />
                                    <PreviewCard title="mororeflexes" value={oldPayload.paediatricsspecific?.mororeflexes} />
                                    <PreviewCard title="tonicneckreflexes" value={oldPayload.paediatricsspecific?.tonicneckreflexes} />
                                    <PreviewCard title="graspreflexes" value={oldPayload.paediatricsspecific?.graspreflexes} />
                                    <PreviewCard title="steppingreflexes" value={oldPayload.paediatricsspecific?.steppingreflexes} />


                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        AssessmentDiagnosis.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{AssessmentDiagnosis.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="assessment" value={oldPayload.assessment} />
                                    <PreviewCard title="assessmentnote" value={oldPayload.assessmentnote} />
                                    <PreviewCard title="diagosis" value={oldPayload.diagosis} />
                                    <PreviewCard title="diagosisnote" value={oldPayload.diagosisnote} />
                                    <PreviewCard title="icpc2" value={oldPayload.icpc2} />
                                    <PreviewCard title="icpc2note" value={oldPayload.icpc2note} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        MedicalHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{MedicalHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                    <PreviewCard title="attention deficit disorder  " value={oldPayload.medicalhistory?.attentiondeficitdisorderhyperactivitydisorder} />
                                    <PreviewCard title="attention deficit disorder  note" value={oldPayload.medicalhistory?.attentiondeficitdisorderhyperactivitydisordernote} />
                                    <PreviewCard title="constipation" value={oldPayload.medicalhistory?.constipation} />
                                    <PreviewCard title="constipatio nnote" value={oldPayload.medicalhistory?.constipationnote} />
                                    <PreviewCard title="fatigue" value={oldPayload.medicalhistory?.fatigue} />
                                    <PreviewCard title="fatigue note" value={oldPayload.medicalhistory?.fatiguenote} />
                                    <PreviewCard title="orthopedic conditions" value={oldPayload.medicalhistory?.orthopedicconditions} />
                                    <PreviewCard title="orthopedic conditions note" value={oldPayload.medicalhistory?.orthopedicconditionsnote} />
                                    <PreviewCard title="allergies" value={oldPayload.medicalhistory?.allergies} />
                                    <PreviewCard title="allergies note" value={oldPayload.medicalhistory?.allergiesnote} />
                                    <PreviewCard title="diabetes" value={oldPayload.medicalhistory?.diabetes} />
                                    <PreviewCard title="diabetes note" value={oldPayload.medicalhistory?.diabetesnote} />
                                    <PreviewCard title="headaches" value={oldPayload.medicalhistory?.headaches} />
                                    <PreviewCard title="head aches note" value={oldPayload.medicalhistory?.headachesnote} />
                                    <PreviewCard title="scoliosis" value={oldPayload.medicalhistory?.scoliosis} />
                                    <PreviewCard title="scoliosis note" value={oldPayload.medicalhistory?.scoliosisnote} />
                                    <PreviewCard title="asthma" value={oldPayload.medicalhistory?.asthma} />
                                    <PreviewCard title="asthma note" value={oldPayload.medicalhistory?.asthmanote} />
                                    <PreviewCard title="digestive problems" value={oldPayload.medicalhistory?.digestiveproblems} />
                                    <PreviewCard title="digestiveproblems note" value={oldPayload.medicalhistory?.digestiveproblemsnote} />
                                    <PreviewCard title="hearing difficulties" value={oldPayload.medicalhistory?.hearingdifficulties} />
                                    <PreviewCard title="hearing difficulties note" value={oldPayload.medicalhistory?.hearingdifficultiesnote} />
                                    <PreviewCard title="seizures" value={oldPayload.medicalhistory?.seizures} />
                                    <PreviewCard title="seizures note" value={oldPayload.medicalhistory?.seizuresnote} />
                                    <PreviewCard title="blood disorder" value={oldPayload.medicalhistory?.blooddisorder} />
                                    <PreviewCard title="blood disorder note" value={oldPayload.medicalhistory?.blooddisordernote} />
                                    <PreviewCard title="depression anxiety" value={oldPayload.medicalhistory?.depressionanxiety} />
                                    <PreviewCard title="depression anxiety note" value={oldPayload.medicalhistory?.depressionanxietynote} />
                                    <PreviewCard title="heart problems" value={oldPayload.medicalhistory?.heartproblems} />
                                    <PreviewCard title="heart problems note" value={oldPayload.medicalhistory?.heartproblemsnote} />
                                    <PreviewCard title="sleep disturbances" value={oldPayload.medicalhistory?.sleepdisturbances} />
                                    <PreviewCard title="sleep disturbances note" value={oldPayload.medicalhistory?.sleepdisturbancesnote} />
                                    <PreviewCard title="chroniccolds" value={oldPayload.medicalhistory?.chroniccolds} />
                                    <PreviewCard title="dyslexia" value={oldPayload.medicalhistory?.dyslexia} />
                                    <PreviewCard title="dyslexia note" value={oldPayload.medicalhistory?.dyslexianote} />
                                    <PreviewCard title="kidney disorders" value={oldPayload.medicalhistory?.kidneydisorders} />
                                    <PreviewCard title="kidney disorders note" value={oldPayload.medicalhistory?.kidneydisordersnote} />
                                    <PreviewCard title="colic" value={oldPayload.medicalhistory?.colic} />
                                    <PreviewCard title="colic note" value={oldPayload.medicalhistory?.colicnote} />
                                    <PreviewCard title="torticollis" value={oldPayload.medicalhistory?.torticollis} />
                                    <PreviewCard title="ear infections" value={oldPayload.medicalhistory?.earinfections} />
                                    <PreviewCard title="ear infections note" value={oldPayload.medicalhistory?.earinfectionsnote} />
                                    <PreviewCard title="lymph disorders" value={oldPayload.medicalhistory?.lymphdisorders} />
                                    <PreviewCard title="lymph disorders note" value={oldPayload.medicalhistory?.lymphdisordersnote} />
                                    <PreviewCard title="vision difficulties" value={oldPayload.medicalhistory?.visiondifficulties} />
                                    <PreviewCard title="vision difficulties note" value={oldPayload.medicalhistory?.visiondifficultiesnote} />
                                    <PreviewCard title="autism" value={oldPayload.medicalhistory?.autism} />
                                    <PreviewCard title="autism note" value={oldPayload.medicalhistory?.autismnote} />
                                    <PreviewCard title="sensory processing challenges" value={oldPayload.medicalhistory?.sensoryprocessingchallenges} />
                                    <PreviewCard title="sensory processing challenges note" value={oldPayload.medicalhistory?.sensoryprocessingchallengesnote} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PrenatalHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PrenatalHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                  <PreviewCard title="stressors" value={oldPayload.prepostnatalhistory?.stressors} />
                                  <PreviewCard title="stressors note" value={oldPayload.prepostnatalhistory?.stressorsnote} />
                                  <PreviewCard title="pregnancy medication" value={oldPayload.prepostnatalhistory?.pregnancymedication} />
                                  <PreviewCard title="pregnancy medication note" value={oldPayload.prepostnatalhistory?.pregnancymedicationnote} />
                                  <PreviewCard title="cigarette alcohol use" value={oldPayload.prepostnatalhistory?.cigarettealcoholuse} />
                                  <PreviewCard title="cigarette alcohol use note" value={oldPayload.prepostnatalhistory?.cigarettealcoholusenote} />
                                  <PreviewCard title="delivery" value={oldPayload.prepostnatalhistory?.delivery} />
                                  <PreviewCard title="delivery note" value={oldPayload.prepostnatalhistory?.deliverynote} />
                                  <PreviewCard title="delivery type" value={oldPayload.prepostnatalhistory?.deliverytype} />
                                  <PreviewCard title="delivery type note" value={oldPayload.prepostnatalhistory?.deliverytypenote} />
                                  <PreviewCard title="emergency delivery" value={oldPayload.prepostnatalhistory?.emergencydelivery} />
                                  <PreviewCard title="emergency delivery note" value={oldPayload.prepostnatalhistory?.emergencydeliverynote} />
                                  <PreviewCard title="labour induction" value={oldPayload.prepostnatalhistory?.labourinduction} />
                                  <PreviewCard title="labour induction note" value={oldPayload.prepostnatalhistory?.labourinductionnote} />
                                  <PreviewCard title="birth history medication" value={oldPayload.prepostnatalhistory?.birthhistorymedication} />
                                  <PreviewCard title="birth history medication note" value={oldPayload.prepostnatalhistory?.birthhistorymedicationnote} />
                                  <PreviewCard title="birth weight" value={oldPayload.prepostnatalhistory?.birthweight} />
                                  <PreviewCard title="birth length height" value={oldPayload.prepostnatalhistory?.birthlengthheight} />
                                  <PreviewCard title="assisted delivery" value={oldPayload.prepostnatalhistory?.assisteddelivery} />
                                  <PreviewCard title="assisted delivery note" value={oldPayload.prepostnatalhistory?.assisteddeliverynote} />
                                  <PreviewCard title="type of assisted delivery" value={oldPayload.prepostnatalhistory?.typeofassisteddelivery} />
                                  <PreviewCard title="type of assisted delivery note" value={oldPayload.prepostnatalhistory?.typeofassisteddeliverynote} />
                                  <PreviewCard title="complications during delivery note" value={oldPayload.prepostnatalhistory?.complicationsduringdeliverynote} />
                                  <PreviewCard title="complications during delivery" value={oldPayload.prepostnatalhistory?.complicationsduringdelivery} />
                                  <PreviewCard title="apgar score after one minute" value={oldPayload.prepostnatalhistory?.apgarscoreafteroneminute} />
                                  <PreviewCard title="apgar score after five minutes" value={oldPayload.prepostnatalhistory?.apgarscoreafterfiveminutes} />
                                  <PreviewCard title="use of oxygen afterbirth" value={oldPayload.prepostnatalhistory?.useofoxygenafterbirth} />
                                  <PreviewCard title="feeding of the child" value={oldPayload.prepostnatalhistory?.feedingofthechild} />
                                  <PreviewCard title="feeding of the child note" value={oldPayload.prepostnatalhistory?.feedingofthechildnote} />
                                  <PreviewCard title="difficultyinlatchingsucking" value={oldPayload.prepostnatalhistory?.difficultyinlatchingsucking} />
                                  <PreviewCard title="difficulty in latching suckingnote" value={oldPayload.prepostnatalhistory?.difficultyinlatchingsuckingnote} />
                                
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        ImmunizationHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{ImmunizationHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                  <PreviewCard title="immunization" value={oldPayload.immunizationhistory?.immunization} />
                                  <PreviewCard title="hepb0" value={oldPayload.immunizationhistory?.hepb0 ? "yes": ""} />
                                  <PreviewCard title="opv0" value={oldPayload.immunizationhistory?.opv0 ? "yes": ""} />
                                  <PreviewCard title="bcg" value={oldPayload.immunizationhistory?.bcg ? "yes": ""} />
                                  <PreviewCard title="opv1" value={oldPayload.immunizationhistory?.opv1 ? "yes": ""} />
                                  <PreviewCard title="penta1" value={oldPayload.immunizationhistory?.penta1 ? "yes": ""} />
                                  <PreviewCard title="pcv1" value={oldPayload.immunizationhistory?.pcv1 ? "yes": ""} />
                                  <PreviewCard title="rota1" value={oldPayload.immunizationhistory?.rota1 ? "yes": ""} />
                                  <PreviewCard title="opv2" value={oldPayload.immunizationhistory?.opv2 ? "yes": ""} />
                                  <PreviewCard title="pcv2" value={oldPayload.immunizationhistory?.pcv2 ? "yes": ""} />
                                  <PreviewCard title="rota2" value={oldPayload.immunizationhistory?.rota2 ? "yes": ""} />
                                  <PreviewCard title="opv3" value={oldPayload.immunizationhistory?.opv3 ? "yes": ""} />
                                  <PreviewCard title="penta3" value={oldPayload.immunizationhistory?.penta3 ? "yes": ""} />
                                  <PreviewCard title="pcv3" value={oldPayload.immunizationhistory?.pcv3 ? "yes": ""} />
                                  <PreviewCard title="rota3" value={oldPayload.immunizationhistory?.rota3 ? "yes": ""} />
                                  <PreviewCard title="ipv" value={oldPayload.immunizationhistory?.ipv ? "yes": ""} />
                                  <PreviewCard title="vitamina1" value={oldPayload.immunizationhistory?.vitamina1 ? "yes": ""} />
                                  <PreviewCard title="vitamina2" value={oldPayload.immunizationhistory?.vitamina2 ? "yes": ""} />
                                  <PreviewCard title="measles" value={oldPayload.immunizationhistory?.measles ? "yes": ""} />
                                  <PreviewCard title="yellowfever" value={oldPayload.immunizationhistory?.yellowfever ? "yes": ""} />
                                  <PreviewCard title="mena" value={oldPayload.immunizationhistory?.mena ? "yes": ""} />
                                  <PreviewCard title="measles2" value={oldPayload.immunizationhistory?.measles2 ? "yes": ""} />
                                  <PreviewCard title="hpv914" value={oldPayload.immunizationhistory?.hpv914 ? "yes": ""} />
                                  <PreviewCard title="llin" value={oldPayload.immunizationhistory?.llin ? "yes": ""} />
                                  
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        DevelopmentalHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{DevelopmentalHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                  <PreviewCard title="age when rolled over" value={oldPayload.developmentmilestonehistorydetails?.agewhenrolledover} />
                                  <PreviewCard title="sat up unsupported" value={oldPayload.developmentmilestonehistorydetails?.satupunsupported} />
                                  <PreviewCard title="crawled" value={oldPayload.developmentmilestonehistorydetails?.crawled} />
                                  <PreviewCard title="walked" value={oldPayload.developmentmilestonehistorydetails?.walked} />
                                  <PreviewCard title="spoke first word" value={oldPayload.developmentmilestonehistorydetails?.spokefirstword} />
                                  <PreviewCard title="spoke in sentences" value={oldPayload.developmentmilestonehistorydetails?.spokeinsentences} />
                                  <PreviewCard title="total trianed" value={oldPayload.developmentmilestonehistorydetails?.totaltrianed} />
                                  <PreviewCard title="any food allergies" value={oldPayload.developmentmilestonehistorydetails?.anyfoodallergies} />
                                  <PreviewCard title="any food allergies note" value={oldPayload.developmentmilestonehistorydetails?.anyfoodallergiesnote} />
                                  <PreviewCard title="contact type sport" value={oldPayload.developmentmilestonehistorydetails?.contacttypesport} />
                                  <PreviewCard title="contact type sport note" value={oldPayload.developmentmilestonehistorydetails?.contacttypesportnote} />
                                  <PreviewCard title="history of car accident" value={oldPayload.developmentmilestonehistorydetails?.historyofcaraccident} />
                                  <PreviewCard title="history of car accident note" value={oldPayload.developmentmilestonehistorydetails?.historyofcaraccidentnote} />
                                  <PreviewCard title="ever been seen on emergency" value={oldPayload.developmentmilestonehistorydetails?.everbeenseenonemergency} />
                                  <PreviewCard title="ever been seen on emergency note" value={oldPayload.developmentmilestonehistorydetails?.everbeenseenonemergencynote} />
                                  <PreviewCard title="other history of trauma" value={oldPayload.developmentmilestonehistorydetails?.otherhistoryoftrauma} />
                                  <PreviewCard title="other history of trauma note" value={oldPayload.developmentmilestonehistorydetails?.otherhistoryoftraumanote} />
                                  <PreviewCard title="history of frequent falls" value={oldPayload.developmentmilestonehistorydetails?.historyoffrequentfalls} />
                                  <PreviewCard title="history of frequent falls note" value={oldPayload.developmentmilestonehistorydetails?.historyoffrequentfallsnote} />
                                  <PreviewCard title="any sign of muscle weakness note" value={oldPayload.developmentmilestonehistorydetails?.anysignofmuscleweaknessnote} />
                                  <PreviewCard title="any sign of muscle weakness" value={oldPayload.developmentmilestonehistorydetails?.anysignofmuscleweakness} />
                                  
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PhysicalCvs.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalCvs.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="bp diastolic" value={oldPayload?.cvs?.bpdiastolic} />
                                    <PreviewCard title="bp systolic" value={oldPayload?.cvs?.bpsystolic} />
                                    <PreviewCard title="capillary refill time" value={oldPayload?.cvs?.capillaryrefilltime} />
                                    <PreviewCard title="cvs remark" value={oldPayload?.cvs?.cvsremark} />
                                    <PreviewCard title="edema" value={oldPayload?.cvs?.edema} />
                                    <PreviewCard title="heart murmur grade" value={oldPayload?.cvs?.heartmurmurgrade} />
                                    <PreviewCard title="heart murmur pitch" value={oldPayload?.cvs?.heartmurmurpitch} />
                                    <PreviewCard title="heart murmur quality" value={oldPayload?.cvs?.heartmurmurquality} />
                                    <PreviewCard title="heart murmur timing" value={oldPayload?.cvs?.heartmurmurtiming} />
                                    <PreviewCard title="heart rate" value={oldPayload?.cvs?.heartrate} />
                                    <PreviewCard title="heart rate rhythm" value={oldPayload?.cvs?.heartraterhythm} />
                                    <PreviewCard title="heart sound" value={oldPayload?.cvs?.heartsound} />
                                    <PreviewCard title="jugular vein distention" value={oldPayload?.cvs?.jugularveindistention} />
                                    <PreviewCard title="jugular vein distention head up 30 degree" value={oldPayload?.cvs?.jugularveindistentionheadup30degree} />
                                    <PreviewCard title="hear murmur location auscultation sound" value={oldPayload?.cvs?.heartsound} />
                                    <PreviewCard title="murmur radiating to body location" value={oldPayload?.cvs?.murmurradiatingtobodylocation} />
                                    <PreviewCard title="temperature extrmities" value={oldPayload?.cvs?.temperatureextrmities} />



                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PhysicalResp.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalResp.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="breath sounds auscultation" value={oldPayload.resp?.breathsoundsauscultation} />
                                    <PreviewCard title="localized breath sounds" value={oldPayload.resp?.localizedbreathsounds} />
                                    <PreviewCard title="respiratory assessment impression" value={oldPayload.resp?.respiratoryassessmentimpression} />
                                    <PreviewCard title="respiratory effort" value={oldPayload.resp?.respiratoryeffort} />
                                    <PreviewCard title="respiratory rate" value={oldPayload.resp?.respiratoryrate} />
                                    <PreviewCard title="respiratory rhthm" value={oldPayload.resp?.respiratoryrhthm} />
                                    <PreviewCard title="resp remarks" value={oldPayload.resp?.respremarks} />


                                </SimpleGrid>
                            </Box>
                        )
                    }

                    {
                        PhysicalGi.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalGi.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="bowel sound auscultation" value={oldPayload.gi?.bowelsoundauscultation} />
                                    <PreviewCard title="bowel sound by quality auscultation" value={oldPayload.gi?.bowelsoundbyqualityauscultation} />
                                    <PreviewCard title="bs quad auscultation" value={oldPayload.gi?.bsquadauscultation} />
                                    <PreviewCard title="gi assessment impression" value={oldPayload.gi?.giassessmentimpression} />
                                    <PreviewCard title="gi remarks" value={oldPayload.gi?.giremarks} />
                                    <PreviewCard title="physiologic finding by palpation" value={oldPayload.gi?.physiologicfindingbypalpation} />


                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PhysicalGu.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalGu.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="appearance urine" value={oldPayload.gu?.appearanceurine} />
                                    <PreviewCard title="blood loss volume" value={oldPayload.gu?.bloodlossvolume} />
                                    <PreviewCard title="color urine" value={oldPayload.gu?.colorurine} />
                                    <PreviewCard title="diaper count" value={oldPayload.gu?.diapercount} />
                                    <PreviewCard title="genitourinary assessment impression" value={oldPayload.gu?.genitourinaryassessmentimpression} />
                                    <PreviewCard title="genitouring assessment impressions" value={oldPayload.gu?.genitouringassessmentimpressions} />
                                    <PreviewCard title="incontinent void surinary" value={oldPayload.gu?.incontinentvoidsurinary} />
                                    <PreviewCard title="number voids" value={oldPayload.gu?.numbervoids} />
                                    <PreviewCard title="other urine" value={oldPayload.gu?.otherurine} />
                                    <PreviewCard title="perineal pads count" value={oldPayload.gu?.perinealpadscount} />
                                    <PreviewCard title="urine collectio ndevice" value={oldPayload.gu?.urinecollectiondevice} />
                                    <PreviewCard title="urine color" value={oldPayload.gu?.urinecolor} />
                                    <PreviewCard title="urine odor" value={oldPayload.gu?.urineodor} />
                                    <PreviewCard title="urine turbidity" value={oldPayload.gu?.urineturbidity} />
                                    <PreviewCard title="voiding pattern" value={oldPayload.gu?.voidingpattern} />
                                    <PreviewCard title="voiding pattern gu" value={oldPayload.gu?.voidingpatterngu} />
                                    <PreviewCard title="gu remark" value={oldPayload.gu?.guremark} />



                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PhysicalNeuro.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalNeuro.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="ability to concentrate" value={oldPayload.neuro?.abilitytoconcentrate} />
                                    <PreviewCard title="ability to direct attention" value={oldPayload.neuro?.abilitytodirectattention} />
                                    <PreviewCard title="cniexam" value={oldPayload.neuro?.cniexam} />
                                    <PreviewCard title="cniiexam" value={oldPayload.neuro?.cniiexam} />
                                    <PreviewCard title="cniiiexam" value={oldPayload.neuro?.cniiiexam} />
                                    <PreviewCard title="cnivexam" value={oldPayload.neuro?.cnivexam} />
                                    <PreviewCard title="cniviiexam" value={oldPayload.neuro?.cniviiexam} />
                                    <PreviewCard title="cniviiiexam" value={oldPayload.neuro?.cniviiiexam} />
                                    <PreviewCard title="cnixexam" value={oldPayload.neuro?.cnixexam} />
                                    <PreviewCard title="cnvexam" value={oldPayload.neuro?.cnvexam} />
                                    <PreviewCard title="cnviexam" value={oldPayload.neuro?.cnviexam} />
                                    <PreviewCard title="cnxexam" value={oldPayload.neuro?.cnxexam} />
                                    <PreviewCard title="cnxiexam" value={oldPayload.neuro?.cnxiexam} />
                                    <PreviewCard title="cnxiiexam" value={oldPayload.neuro?.cnxiiexam} />
                                    <PreviewCard title="glas gowcoma scale" value={oldPayload.neuro?.glasgowcomascale} />
                                    <PreviewCard title="level of arousal" value={oldPayload.neuro?.levelofarousal} />
                                    <PreviewCard title="level of consciousness" value={oldPayload.neuro?.levelofconsciousness} />
                                    <PreviewCard title="neurology assessment impression" value={oldPayload.neuro?.neurologyassessmentimpression} />
                                    <PreviewCard title="orientation assessment impression" value={oldPayload.neuro?.orientationassessmentimpression} />
                                    <PreviewCard title="patient memory" value={oldPayload.neuro?.patientmemory} />
                                    <PreviewCard title="patient mood" value={oldPayload.neuro?.patientmood} />
                                    <PreviewCard title="person" value={oldPayload.neuro?.person} />
                                    <PreviewCard title="physiologic find ingopticlens" value={oldPayload.neuro?.physiologicfindingopticlens} />
                                    <PreviewCard title="place" value={oldPayload.neuro?.place} />
                                    <PreviewCard title="pupil assessment impression" value={oldPayload.neuro?.pupilassessmentimpression} />
                                    <PreviewCard title="pupil diametereyel" value={oldPayload.neuro?.pupildiametereyel} />
                                    <PreviewCard title="pupil diametereyer" value={oldPayload.neuro?.pupildiametereyer} />
                                    <PreviewCard title="pupillary responsepupill" value={oldPayload.neuro?.pupillaryresponsepupill} />
                                    <PreviewCard title="pupillary responsepupilr" value={oldPayload.neuro?.pupillaryresponsepupilr} />
                                    <PreviewCard title="pupil shape left pupil" value={oldPayload.neuro?.pupilshapeleftpupil} />
                                    <PreviewCard title="pupil shape right pupil" value={oldPayload.neuro?.pupilshaperightpupil} />
                                    <PreviewCard title="speech clarity" value={oldPayload.neuro?.speechclarity} />
                                    <PreviewCard title="time" value={oldPayload.neuro?.time} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PhysicalMsk.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalMsk.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="active range abduction hip l" value={oldPayload.msk?.activerangeabductionhipl} />
                                    <PreviewCard title="active range abduction hip r" value={oldPayload.msk?.activerangeabductionhipr} />
                                    <PreviewCard title="active range abduction shoulder l" value={oldPayload.msk?.activerangeabductionshoulderl} />
                                    <PreviewCard title="active range abduction shoulder r" value={oldPayload.msk?.activerangeabductionshoulderr} />
                                    <PreviewCard title="active range adduction hip l" value={oldPayload.msk?.activerangeadductionhipl} />
                                    <PreviewCard title="active range adduction hip r" value={oldPayload.msk?.activerangeadductionhipr} />
                                    <PreviewCard title="active range adduction shoulder l" value={oldPayload.msk?.activerangeadductionshoulderl} />
                                    <PreviewCard title="active range adduction shoulder r" value={oldPayload.msk?.activerangeadductionshoulderr} />
                                    <PreviewCard title="active range extension elbow l" value={oldPayload.msk?.activerangeextensionelbowl} />
                                    <PreviewCard title="active range extension elbow r" value={oldPayload.msk?.activerangeextensionelbowr} />
                                    <PreviewCard title="active range extension hipl " value={oldPayload.msk?.activerangeextensionhipl} />
                                    <PreviewCard title="active range extension hip r" value={oldPayload.msk?.activerangeextensionhipr} />
                                    <PreviewCard title="active range extension knee l" value={oldPayload.msk?.activerangeextensionkneel} />
                                    <PreviewCard title="active range extension knee r" value={oldPayload.msk?.activerangeextensionkneer} />
                                    <PreviewCard title="active range extension shoulder l" value={oldPayload.msk?.activerangeextensionshoulderl} />
                                    <PreviewCard title="active range extension shoulder r" value={oldPayload.msk?.activerangeextensionshoulderr} />
                                    <PreviewCard title="active range external rotation hip l" value={oldPayload.msk?.activerangeexternalrotationhipl} />
                                    <PreviewCard title="active range external rotation hip r" value={oldPayload.msk?.activerangeexternalrotationhipr} />
                                    <PreviewCard title="active range external rotation shoulder l" value={oldPayload.msk?.activerangeexternalrotationshoulderl} />
                                    <PreviewCard title="active range external rotation shoulder r" value={oldPayload.msk?.activerangeexternalrotationshoulderr} />
                                    <PreviewCard title="active range flexion elbow l" value={oldPayload.msk?.activerangeflexionelbowl} />
                                    <PreviewCard title="active range flexion elbow r" value={oldPayload.msk?.activerangeflexionelbowr} />
                                    <PreviewCard title="active range flexion hip l" value={oldPayload.msk?.activerangeflexionhipl} />
                                    <PreviewCard title="active range flexion hip r" value={oldPayload.msk?.activerangeflexionhipr} />
                                    <PreviewCard title="active range flexion knee l" value={oldPayload.msk?.activerangeflexionkneel} />
                                    <PreviewCard title="active range flexion knee r" value={oldPayload.msk?.activerangeflexionkneer} />
                                    <PreviewCard title="active range flexion shoulder l" value={oldPayload.msk?.activerangeflexionshoulderl} />
                                    <PreviewCard title="active range flexion shoulder r" value={oldPayload.msk?.activerangeflexionshoulderr} />
                                    <PreviewCard title="active range internal rotation hip l" value={oldPayload.msk?.activerangeinternalrotationhipl} />
                                    <PreviewCard title="active range internal rotation hip r" value={oldPayload.msk?.activerangeinternalrotationhipr} />
                                    <PreviewCard title="active range internal rotation shoulder l" value={oldPayload.msk?.activerangeinternalrotationshoulderl} />
                                    <PreviewCard title="babin skis reflex" value={oldPayload.msk?.babinskisreflex} />
                                    <PreviewCard title="dtr achilles" value={oldPayload.msk?.dtrachilles} />
                                    <PreviewCard title="dtr biceps" value={oldPayload.msk?.dtrbiceps} />
                                    <PreviewCard title="dtr brachioradialis" value={oldPayload.msk?.dtrbrachioradialis} />
                                    <PreviewCard title="dtr patellar" value={oldPayload.msk?.dtrpatellar} />
                                    <PreviewCard title="dtr triceps" value={oldPayload.msk?.dtrtriceps} />
                                    <PreviewCard title="involuntary movements" value={oldPayload.msk?.involuntarymovements} />
                                    <PreviewCard title="msk remark" value={oldPayload.msk?.mskremark} />
                                    <PreviewCard title="muscle strength" value={oldPayload.msk?.musclestrength} />
                                    <PreviewCard title="muscle tone" value={oldPayload.msk?.muscletone} />
                                    <PreviewCard title="musculo skeletal assessment impression" value={oldPayload.msk?.musculoskeletalassessmentimpression} />
                                    <PreviewCard title="oculocephalic" value={oldPayload.msk?.oculocephalic} />
                                    <PreviewCard title="paralysistype" value={oldPayload.msk?.paralysistype} />
                                    <PreviewCard title="paresthesiatype" value={oldPayload.msk?.paresthesiatype} />
                                    <PreviewCard title="passive range abduction hip l" value={oldPayload.msk?.passiverangeabductionhipl} />
                                    <PreviewCard title="passive range abduction hip r" value={oldPayload.msk?.passiverangeabductionhipr} />
                                    <PreviewCard title="passive range abduction shoulder l" value={oldPayload.msk?.passiverangeabductionshoulderl} />
                                    <PreviewCard title="passive range abduction shoulder r" value={oldPayload.msk?.passiverangeabductionshoulderr} />
                                    <PreviewCard title="passive range adduction hip l" value={oldPayload.msk?.passiverangeadductionhipl} />
                                    <PreviewCard title="passive range adduction hip r" value={oldPayload.msk?.passiverangeadductionhipr} />
                                    <PreviewCard title="passive range adduction shoulder l" value={oldPayload.msk?.passiverangeadductionshoulderl} />
                                    <PreviewCard title="passive range adduction shoulder r" value={oldPayload.msk?.passiverangeadductionshoulderr} />
                                    <PreviewCard title="passive range extension elbowl" value={oldPayload.msk?.passiverangeextensionelbowl} />
                                    <PreviewCard title="passive range extension elbowr" value={oldPayload.msk?.passiverangeextensionelbowr} />
                                    <PreviewCard title="passive range extension hipl" value={oldPayload.msk?.passiverangeextensionhipl} />
                                    <PreviewCard title="passive range extension hipr" value={oldPayload.msk?.passiverangeextensionhipr} />
                                    <PreviewCard title="passive range extension shoulderl" value={oldPayload.msk?.passiverangeextensionshoulderl} />
                                    <PreviewCard title="passive range extension shoulderr" value={oldPayload.msk?.passiverangeextensionshoulderr} />
                                    <PreviewCard title="passive range external rotation hip l" value={oldPayload.msk?.passiverangeexternalrotationhipl} />
                                    <PreviewCard title="passive range external rotation hip r" value={oldPayload.msk?.passiverangeexternalrotationhipr} />
                                    <PreviewCard title="passive range external rotation shoulder l" value={oldPayload.msk?.passiverangeexternalrotationshoulderl} />
                                    <PreviewCard title="passive range external rotation shoulder r" value={oldPayload.msk?.passiverangeexternalrotationshoulderr} />
                                    <PreviewCard title="passive range flexion elbow l" value={oldPayload.msk?.passiverangeflexionelbowl} />
                                    <PreviewCard title="passive range flexion hip l" value={oldPayload.msk?.passiverangeflexionhipl} />
                                    <PreviewCard title="passive range flexion hip r" value={oldPayload.msk?.passiverangeflexionhipr} />
                                    <PreviewCard title="passive range flexion shoulder l" value={oldPayload.msk?.passiverangeflexionshoulderl} />
                                    <PreviewCard title="passive range flexion shoulder r" value={oldPayload.msk?.passiverangeflexionshoulderr} />
                                    <PreviewCard title="passive range internal rotation hip l" value={oldPayload.msk?.passiverangeinternalrotationhipl} />
                                    <PreviewCard title="passive range internal rotation hipr" value={oldPayload.msk?.passiverangeinternalrotationhipr} />
                                    <PreviewCard title="passive range internal rotation shoulderl" value={oldPayload.msk?.passiverangeinternalrotationshoulderl} />
                                    <PreviewCard title="passive range internal rotation shoulderr" value={oldPayload.msk?.passiverangeinternalrotationshoulderr} />
                                    <PreviewCard title="physiologic finding" value={oldPayload.msk?.physiologicfinding} />


                                </SimpleGrid>
                            </Box>
                        )
                    }







                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
