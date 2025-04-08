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


export default function PreviewANC({ isOpen, onClose, oldPayload }) {


    const [ReproductiveProfile, setReproductiveProfile] = useState({
        title: "Reproductive Profile",
        display: false,

    });


    const [ObstetricHistory, setObstetricHistory] = useState({
        title: "history ~ Obstetric",
        display: false,

    });
    const [PastObstetricHistory, setPastObstetricHistory] = useState({
        title: "history ~ Past Obstetric",
        display: false,

    });
    const [PresentingComplaints, setPresentingComplaints] = useState({
        title: "PresentingComplaints",
        display: false,

    });
    const [MedicalObstetricHistory, setMedicalObstetricHistory] = useState({
        title: "history ~ Medical Obstetric",
        display: false,

    });
    const [CurrentHistory, setCurrentHistory] = useState({
        title: "history ~ current",
        display: false,

    });
    const [GeneralMedicalHistory, setGeneralMedicalHistory] = useState({
        title: "history ~ General Medical",
        display: false,

    });
    const [PhysicalExamination, setPhysicalExamination] = useState({
        title: "physical examination",
        display: false,

    });
    const [LabExamination, setLabExamination] = useState({
        title: "laboratory examination",
        display: false,

    });
    const [HealthEducation, setHealthEducation] = useState({
        title: "health education",
        display: false,

    });
    const [TetanusGiven, setTetanusGiven] = useState({
        title: "Tetanus Given",
        display: false,

    });

    const [IPTGiven, setIPTGiven] = useState({
        title: "IPT Given",
        display: false,

    });
    const [IronGiven, setIronGiven] = useState({
        title: "Iron Given",
        display: false,

    });


    useEffect(() => {


        const pregnancySummaryPayload = {

            currentmedication: oldPayload.currentmedication,
            allergies: oldPayload.allergies,
            lmp: oldPayload.lmp,
            cycle: oldPayload.cycle,
            edd: oldPayload.edd,
            gravida: oldPayload.gravida,
            term: oldPayload.term,
            preterm: oldPayload.preterm,
            abortions: oldPayload.abortions,
            ectopic: oldPayload.ectopic,
            stillbirths: oldPayload.stillbirths,
            noliving: oldPayload.noliving,
            gravidity: oldPayload.gravidity,
            ega: oldPayload.ega,
            lcb: oldPayload.lcb,
            bookingstatus: oldPayload.bookingstatus,
        }

        if (Object.values(pregnancySummaryPayload).some(value => value !== null && value !== "" )) {
            setReproductiveProfile({ ...ReproductiveProfile, display: true })
        } else {
            setReproductiveProfile({ ...ReproductiveProfile, display: false })
        }


        if (oldPayload.obstetrichistory) {
            setObstetricHistory({ ...ObstetricHistory, display: true })
        } else {
            setObstetricHistory({ ...ObstetricHistory, display: false })
        }

        if (oldPayload.pastobstetrichistory) {
            setPastObstetricHistory({ ...PastObstetricHistory, display: true })
        } else {
            setPastObstetricHistory({ ...PastObstetricHistory, display: false })
        }
        if (oldPayload.presentingcomplaints) {
            setPresentingComplaints({ ...PresentingComplaints, display: true })
        } else {
            setPresentingComplaints({ ...PresentingComplaints, display: false })
        }


        if (oldPayload.medicalobsterichistory) {
            setMedicalObstetricHistory({ ...MedicalObstetricHistory, display: true })
        } else {
            setMedicalObstetricHistory({ ...MedicalObstetricHistory, display: false })
        }

      
        if (oldPayload.currenthistory) {
            setCurrentHistory({ ...CurrentHistory, display: true })
        } else {
            setCurrentHistory({ ...CurrentHistory, display: false })
        }

        if (oldPayload.generalmedicalhistory) {
            setGeneralMedicalHistory({ ...GeneralMedicalHistory, display: true })
        } else {
            setGeneralMedicalHistory({ ...GeneralMedicalHistory, display: false })
        }
        if (oldPayload.physicalexamination) {
            setPhysicalExamination({ ...PhysicalExamination, display: true })
        } else {
            setPhysicalExamination({ ...PhysicalExamination, display: false })
        }
        if (oldPayload.laboratory) {
            setLabExamination({ ...LabExamination, display: true })
        } else {
            setLabExamination({ ...LabExamination, display: false })
        }
        if (oldPayload.healtheducationtopicscovered) {
            setHealthEducation({ ...HealthEducation, display: true })
        } else {
            setHealthEducation({ ...HealthEducation, display: false })
        }
        if (oldPayload.tetanustoxod) {
            setTetanusGiven({ ...TetanusGiven, display: true })
        } else {
            setTetanusGiven({ ...TetanusGiven, display: false })
        }
        if (oldPayload.ipt) {
            setIPTGiven({ ...IPTGiven, display: true })
        } else {
            setIPTGiven({ ...IPTGiven, display: false })
        }
        if (oldPayload.ironfolategiven) {
            setIronGiven({ ...IronGiven, display: true })
        } else {
            setIronGiven({ ...IronGiven, display: false })
        }



    }, [oldPayload, isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader> Preview ANC Data </ModalHeader>
                <ModalCloseButton />
                <ModalBody>



                    {
                        ReproductiveProfile.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{ReproductiveProfile.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="currentmedication" value={oldPayload.currentmedication} />
                                    <PreviewCard title="allergies" value={oldPayload.allergies} />
                                    <PreviewCard title="lmp" value={oldPayload.lmp} />
                                    <PreviewCard title="cycle" value={oldPayload.cycle} />
                                    <PreviewCard title="lmp" value={oldPayload.lmp} />
                                    <PreviewCard title="edd" value={oldPayload.edd} />
                                    <PreviewCard title="gravida" value={oldPayload.gravida} />
                                    <PreviewCard title="term" value={oldPayload.term} />
                                    <PreviewCard title="preterm" value={oldPayload.preterm} />
                                    <PreviewCard title="abortions" value={oldPayload.abortions} />
                                    <PreviewCard title="ectopic" value={oldPayload.ectopic} />
                                    <PreviewCard title="stillbirths" value={oldPayload.stillbirths} />
                                    <PreviewCard title="noliving" value={oldPayload.noliving} />
                                    <PreviewCard title="gravidity" value={oldPayload.gravidity} />
                                    <PreviewCard title="ega" value={oldPayload.ega} />
                                    <PreviewCard title="lcb" value={oldPayload.lcb} />
                                    <PreviewCard title="bookingstatus" value={oldPayload.bookingstatus} />


                                </SimpleGrid>
                            </Box>
                        )
                    }

                    {
                        ObstetricHistory.display === true && (


                            oldPayload.obstetrichistory?.map((item, i) => (
                                <Box>
                                    <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{ObstetricHistory.title} {i+1}</Text>
                                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                        <PreviewCard title="year" value={item.year} />
                                        <PreviewCard title="sex of child" value={item.sexofchild} />
                                        <PreviewCard title="gestage" value={item.gestage} />
                                        <PreviewCard title="birth weight" value={item.birthweight} />
                                        <PreviewCard title="length of labour" value={item.lengthoflabour} />
                                        <PreviewCard title="place of birth" value={item.placeofbirth} />
                                        <PreviewCard title="type of birth" value={item.typeofbirth} />
                                        <PreviewCard title="comment" value={item.comment} />
                                    
                                    </SimpleGrid>
                                </Box>
                            ))

                        )
                    }
                    {
                        PastObstetricHistory.display === true && (


                            oldPayload.pastobstetrichistory?.map((item, i) => (
                                <Box>
                                    <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PastObstetricHistory.title} {i+1}</Text>
                                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                        <PreviewCard title="year" value={item.year} />
                                        <PreviewCard title="sex of child" value={item.sexofchild} />
                                        <PreviewCard title="gestage" value={item.gestage} />
                                        <PreviewCard title="birth weight" value={item.birthweight} />
                                        <PreviewCard title="length of labour" value={item.lengthoflabour} />
                                        <PreviewCard title="Problems During Pregnancy" value={item.problemsduringpregancy} />
                                        <PreviewCard title="Problems During Delivery" value={item.problemsduringdelivery} />
                                        <PreviewCard title="Problems After Delivery" value={item.problemsafterdelivery} />
                                        <PreviewCard title="Mode Of Delivery" value={item.modeofdelivery} />
                                        <PreviewCard title="place of birth" value={item.placeofbirth} />
                                        <PreviewCard title="type of birth" value={item.typeofbirth} />
                                        <PreviewCard title="comment" value={item.comment} />
                                    
                                    </SimpleGrid>
                                </Box>
                            ))

                        )
                    }
                 

                    {
                        MedicalObstetricHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{MedicalObstetricHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="previous still birth or new born loss" value={oldPayload.medicalobsterichistory?.previousstillbirthornewbornloss} />
                                    <PreviewCard title="history of three or more consecutive spontaneous abortions" value={oldPayload.medicalobsterichistory?.historyofthreeormoreconsecutivespontaneousabortions} />
                                    <PreviewCard title="birth weight of last baby less than 450" value={oldPayload.medicalobsterichistory?.birthweightoflastbabylessthan450} />
                                    <PreviewCard title="birth weight of last baby greater than 450" value={oldPayload.medicalobsterichistory?.birthweightoflastbabygreaterthan450} />
                                    <PreviewCard title="last pregnancy hospital admission for peteclampsia" value={oldPayload.medicalobsterichistory?.lastpregnancyhospitaladmissionforpeteclampsia} />
                                    <PreviewCard title="previous surgery on reproductive tract" value={oldPayload.medicalobsterichistory?.previoussurgeryonreproductivetract} />
                                  


                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        CurrentHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{CurrentHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="diagnosed suspected multiple prenancy" value={oldPayload.currenthistory?.diagnosedsuspectedmultipleprenancy} />
                                    <PreviewCard title="ageless than 16" value={oldPayload.currenthistory?.agelessthan16} />
                                    <PreviewCard title="age more than 40" value={oldPayload.currenthistory?.agemorethan40} />
                                    <PreviewCard title="rhesus negative" value={oldPayload.currenthistory?.rhesusnegative} />
                                    <PreviewCard title="vaginal bleeding" value={oldPayload.currenthistory?.vaginalbleeding} />
                                    <PreviewCard title="pelvic mass" value={oldPayload.currenthistory?.pelvicmass} />
                                    <PreviewCard title="diastolic bp greater than 90" value={oldPayload.currenthistory?.diastolicbpgreaterthan90} />
                                   


                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        GeneralMedicalHistory.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{GeneralMedicalHistory.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="diabetes mellitus" value={oldPayload.generalmedicalhistory?.diabetesmellitus} />
                                    <PreviewCard title="renal disease" value={oldPayload.generalmedicalhistory?.renaldisease} />
                                    <PreviewCard title="cardiac disease" value={oldPayload.generalmedicalhistory?.cardiacdisease} />
                                    <PreviewCard title="sickle cell disease" value={oldPayload.generalmedicalhistory?.sicklecelldisease} />
                                    <PreviewCard title="hiv positive" value={oldPayload.generalmedicalhistory?.hivpositive} />
                                    <PreviewCard title="asthma" value={oldPayload.generalmedicalhistory?.asthma} />
                                    <PreviewCard title="epilepsy" value={oldPayload.generalmedicalhistory?.epilepsy} />
                                    <PreviewCard title="htn" value={oldPayload.generalmedicalhistory?.htn} />
                                    <PreviewCard title="dm" value={oldPayload.generalmedicalhistory?.dm} />
                                    <PreviewCard title="scd" value={oldPayload.generalmedicalhistory?.scd} />
                                    <PreviewCard title="any other severe medical disease or condition specify" value={oldPayload.generalmedicalhistory?.anyotherseveremedicaldeseaseorconditionspecify} />

                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        PhysicalExamination.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{PhysicalExamination.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="weight" value={oldPayload.physicalexamination?.weight} />
                                    <PreviewCard title="blood pressure" value={oldPayload.physicalexamination?.bloodpressure} />
                                    <PreviewCard title="pulse" value={oldPayload.physicalexamination?.pulse} />
                                    <PreviewCard title="head teeth eyes nose throat" value={oldPayload.physicalexamination?.headteetheyesnosethroat} />
                                    <PreviewCard title="thyroid" value={oldPayload.physicalexamination?.thyroid} />
                                    <PreviewCard title="chest" value={oldPayload.physicalexamination?.chest} />
                                    <PreviewCard title="breasts" value={oldPayload.physicalexamination?.breasts} />
                                    <PreviewCard title="cardiovascular" value={oldPayload.physicalexamination?.weight} />
                                    <PreviewCard title="abdomen" value={oldPayload.physicalexamination?.abdomen} />
                                    <PreviewCard title="varicose veins" value={oldPayload.physicalexamination?.varicoseveins} />
                                    <PreviewCard title="neurological exam" value={oldPayload.physicalexamination?.neurologicalexam} />
                                    <PreviewCard title="external genitalia" value={oldPayload.physicalexamination?.externalgenitalia} />
                                    <PreviewCard title="cervix vigina" value={oldPayload.physicalexamination?.cervixvigina} />
                                    <PreviewCard title="uterus" value={oldPayload.physicalexamination?.uterus} />
                                    <PreviewCard title="adnexa" value={oldPayload.physicalexamination?.adnexa} />
                                    <PreviewCard title="anything abnormal" value={oldPayload.physicalexamination?.anythingabnormal} />
                                    <PreviewCard title="additional comment" value={oldPayload.physicalexamination?.additionalcomment} />
                                 
                                  
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        LabExamination.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{LabExamination.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="haemoglobin/haematocrit" value={oldPayload.laboratory?.haemoglobinhaematocrit} />
                                    <PreviewCard title="urinalysis protein sugar" value={oldPayload.laboratory?.urinalysisprotientsugar} />
                                    <PreviewCard title="VDRL or RPR of syphilis" value={oldPayload.laboratory?.vdrlorrprotientsugar} />
                                    <PreviewCard title="blood group and rhesus status" value={oldPayload.laboratory?.boodgroupandrhesusstatus} />
                                    <PreviewCard title="hivtest" value={oldPayload.laboratory?.hivtest} />
                                    <PreviewCard title="urinnemicroscopic" value={oldPayload.laboratory?.urinnemicroscopic} />
                                    <PreviewCard title="haemoglobin" value={oldPayload.laboratory?.haemoglobin} />
                                    
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        HealthEducation.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{HealthEducation.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="nutrition" value={oldPayload.healtheducationtopicscovered?.nutrition} />
                                    <PreviewCard title="rest and exercise" value={oldPayload.healtheducationtopicscovered?.restandexercise} />
                                    <PreviewCard title="malaria in pregnancy" value={oldPayload.healtheducationtopicscovered?.malariainpregnancy} />
                                    <PreviewCard title="safer sex in pregnancy" value={oldPayload.healtheducationtopicscovered?.safersexinpregnancy} />
                                    <PreviewCard title="vct for prevention of mother to child transmission of hiv" value={oldPayload.healtheducationtopicscovered?.vctforpreventionofmotertochildtrnsmissionofhiv} />
                                    <PreviewCard title="birth and emergency readness planning" value={oldPayload.healtheducationtopicscovered?.birthandemergencyreadnessplanning} />
                                    <PreviewCard title="alcohol tobacoo or other drugs used" value={oldPayload.healtheducationtopicscovered?.alcohotobaccoorotherdrugsysed} />
                                    <PreviewCard title="famil planning birth spacing" value={oldPayload.healtheducationtopicscovered?.familyplanningbirthspacing} />
                                    <PreviewCard title="infant feeding options" value={oldPayload.healtheducationtopicscovered?.infantfeedingoptions} />
                                   
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        TetanusGiven.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{TetanusGiven.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="tetanus first dose" value={oldPayload.tetanustoxod?.tetanusfirstdose} />
                                    <PreviewCard title="tetanus first dosedate" value={oldPayload.tetanustoxod?.tetanusfirstdosedate} />
                                    <PreviewCard title="tetanus second dose" value={oldPayload.tetanustoxod?.tetanusseconddose} />
                                    <PreviewCard title="tetatus seond dosedate" value={oldPayload.tetanustoxod?.tetatusseonddosedate} />
                                    <PreviewCard title="tetanus third dose" value={oldPayload.tetanustoxod?.tetanusthirddose} />
                                    <PreviewCard title="tetanus third dosedate" value={oldPayload.tetanustoxod?.tetanusthirddosedate} />
                                    <PreviewCard title="tetatus fourth dose" value={oldPayload.tetanustoxod?.tetatusfourthdose} />
                                    <PreviewCard title="tetanus fourth dosedate" value={oldPayload.tetanustoxod?.tetanusfourthdosedate} />
                                    <PreviewCard title="tetanus fifth dose" value={oldPayload.tetanustoxod?.tetanusfifthdose} />
                                    <PreviewCard title="tetanus fifth dose date" value={oldPayload.tetanustoxod?.tetanusfifthdosedate} />
                                   
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        IPTGiven.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{IPTGiven.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="Ipt first dose" value={oldPayload.ipt?.iptfirstdose} />
                                    <PreviewCard title="Ipt first dosedate" value={oldPayload.ipt?.iptfirstdosedate} />
                                    <PreviewCard title="Ipt second dose" value={oldPayload.ipt?.iptseconddose} />
                                    <PreviewCard title="ipt second dosedate" value={oldPayload.ipt?.iptseconddosedate} />
                                    <PreviewCard title="Ipt third dose" value={oldPayload.ipt?.iptthirddose} />
                                    <PreviewCard title="Ipt third dosedate" value={oldPayload.ipt?.iptthirddosedate} />
                                    <PreviewCard title="ipt fourth dose" value={oldPayload.ipt?.iptfourthdose} />
                                    <PreviewCard title="Ipt fourth dosedate" value={oldPayload.ipt?.iptfourthdosedate} />
                                    <PreviewCard title="Ipt fifth dose" value={oldPayload.ipt?.iptfifthdose} />
                                    <PreviewCard title="Ipt fifth dose date" value={oldPayload.ipt?.iptfifthdosedate} />
                                    <PreviewCard title="Ipt sixth dose" value={oldPayload.ipt?.iptsixthdose} />
                                    <PreviewCard title="Ipt sixth dose date" value={oldPayload.ipt?.iptsixthdosedate} />
                                   
                                </SimpleGrid>
                            </Box>
                        )
                    }
                    {
                        IronGiven.display === true && (

                            <Box>
                                <Text fontSize="18px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">{IronGiven.title}</Text>
                                <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                    <PreviewCard title="prescription" value={oldPayload.ironfolategiven?.prescription} />
                                    <PreviewCard title="tablets" value={oldPayload.ironfolategiven?.tablets} />
                                    <PreviewCard title="iron folate given date" value={oldPayload.ironfolategiven?.ironfolategivendate} />
                                    
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
