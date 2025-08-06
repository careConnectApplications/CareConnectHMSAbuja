import { useState } from "react";
import {
  Text,
  Flex,
  Box,
  SimpleGrid,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { AddEyeExaminationApi } from "../Utils/ApiCalls";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import Preloader from "../Components/Preloader";
import PatientInfoCard from "../Components/PatientInfoCard";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";

export default function AddEyeExamination() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [IsLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Form state based on the API payload structure
  let PatientId = localStorage.getItem("patientId");
  const [formData, setFormData] = useState({
    // Patient and appointment info
    patientId: PatientId,
    appointmentId: id,
    nextAppointmentDate: "",
    
    biomicroscopic: {
      adnexa: { OD: "", OS: "" },
      lids: { OD: "", OS: "" },
      tearBreak: { OD: "", OS: "" },
      conjunctiva: { OD: "", OS: "" },
      cornea: { OD: "", OS: "" },
      antChamber: { OD: "", OS: "" },
      depth: { OD: "", OS: "" },
      cells: { OD: "", OS: "" },
      flare: { OD: "", OS: "" },
      iris: { OD: "", OS: "" },
      colour: { OD: "", OS: "" },
      angles: { OD: "", OS: "" },
      pupil: { OD: "", OS: "" },
      lens: { OD: "", OS: "" },
      clarity: { OD: "", OS: "" },
      antCaps: { OD: "", OS: "" },
      postCaps: { OD: "", OS: "" },
      cortex: { OD: "", OS: "" },
      nucleus: { OD: "", OS: "" },
    },
    ophthalmoscopy: {
      opticDisc: { OD: "", OS: "" },
      size: { OD: "", OS: "" },
      ratio: { OD: "", OS: "" },
      appearance: { OD: "", OS: "" },
      nerveFiber: { OD: "", OS: "" },
      retina: { OD: "", OS: "" },
      macula: { OD: "", OS: "" },
      postRetina: { OD: "", OS: "" },
      vessels: { OD: "", OS: "" },
      periphery: { OD: "", OS: "" },
      vitreous: { OD: "", OS: "" },
    },
    refraction: {
      sphere: { OD: "", OS: "" },
      cyl: { OD: "", OS: "" },
      axis: { OD: "", OS: "" },
      add: { OD: "", OS: "" },
      hPrism: { OD: "", OS: "" },
      hBase: { OD: "", OS: "" },
      vPrism: { OD: "", OS: "" },
      vBase: { OD: "", OS: "" },
      vc: { OD: "", OS: "" },
      bcva: { OD: "", OS: "" },
    },
    phorias: {
      distAt: { unnamed: "", horizontal: "", vertical: "", base: "", refEye: "" },
      nearAt: { unnamed: "", horizontal: "", vertical: "", base: "", refEye: "" },
      method: { input1: "", input2: "" },
    },
  });

  const handleInputChange = (section, field, eye, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [eye]: value,
        },
      },
    }));
  };

  const handlePhoriasChange = (field, column, value) => {
    setFormData((prev) => ({
      ...prev,
      phorias: {
        ...prev.phorias,
        [field]: {
          ...prev.phorias[field],
          [column]: value,
        },
      },
    }));
  };

  const handleGeneralInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Transform form data to match API payload structure
  const transformFormDataToPayload = () => {
    const payload = {
      patientId: formData.patientId,
      appointmentId: formData.appointmentId,
      nextAppointmentDate: formData.nextAppointmentDate,
      
      // Biomicroscopic fields
      adnexaOd: formData.biomicroscopic.adnexa.OD,
      adnexaOs: formData.biomicroscopic.adnexa.OS,
      lidsOd: formData.biomicroscopic.lids.OD,
      lidsOs: formData.biomicroscopic.lids.OS,
      tearBreakOd: formData.biomicroscopic.tearBreak.OD,
      tearBreakOs: formData.biomicroscopic.tearBreak.OS,
      conjunctivaOd: formData.biomicroscopic.conjunctiva.OD,
      conjunctivaOs: formData.biomicroscopic.conjunctiva.OS,
      corneaOd: formData.biomicroscopic.cornea.OD,
      corneaOs: formData.biomicroscopic.cornea.OS,
      antChamberOd: formData.biomicroscopic.antChamber.OD,
      antChamberOs: formData.biomicroscopic.antChamber.OS,
      depthOd: formData.biomicroscopic.depth.OD,
      depthOs: formData.biomicroscopic.depth.OS,
      cellsOd: formData.biomicroscopic.cells.OD,
      cellsOs: formData.biomicroscopic.cells.OS,
      flareOd: formData.biomicroscopic.flare.OD,
      flareOs: formData.biomicroscopic.flare.OS,
      irisOd: formData.biomicroscopic.iris.OD,
      irisOs: formData.biomicroscopic.iris.OS,
      colourOd: formData.biomicroscopic.colour.OD,
      colourOs: formData.biomicroscopic.colour.OS,
      anglesOd: formData.biomicroscopic.angles.OD,
      anglesOs: formData.biomicroscopic.angles.OS,
      pupilOd: formData.biomicroscopic.pupil.OD,
      pupilOs: formData.biomicroscopic.pupil.OS,
      lensOd: formData.biomicroscopic.lens.OD,
      lensOs: formData.biomicroscopic.lens.OS,
      clarityOd: formData.biomicroscopic.clarity.OD,
      clarityOs: formData.biomicroscopic.clarity.OS,
      antCapsOd: formData.biomicroscopic.antCaps.OD,
      antCapsOs: formData.biomicroscopic.antCaps.OS,
      postCapsOd: formData.biomicroscopic.postCaps.OD,
      postCapsOs: formData.biomicroscopic.postCaps.OS,
      cortexOd: formData.biomicroscopic.cortex.OD,
      cortexOs: formData.biomicroscopic.cortex.OS,
      nucleusOd: formData.biomicroscopic.nucleus.OD,
      nucleusOs: formData.biomicroscopic.nucleus.OS,

      // Ophthalmoscopy fields
      opticDiscOd: formData.ophthalmoscopy.opticDisc.OD,
      opticDiscOs: formData.ophthalmoscopy.opticDisc.OS,
      sizeOd: formData.ophthalmoscopy.size.OD,
      sizeOs: formData.ophthalmoscopy.size.OS,
      ratioOd: formData.ophthalmoscopy.ratio.OD,
      ratioOs: formData.ophthalmoscopy.ratio.OS,
      appearanceOd: formData.ophthalmoscopy.appearance.OD,
      appearanceOs: formData.ophthalmoscopy.appearance.OS,
      nerveFiberOd: formData.ophthalmoscopy.nerveFiber.OD,
      nerveFiberOs: formData.ophthalmoscopy.nerveFiber.OS,
      retinaOd: formData.ophthalmoscopy.retina.OD,
      retinaOs: formData.ophthalmoscopy.retina.OS,
      maculaOd: formData.ophthalmoscopy.macula.OD,
      maculaOs: formData.ophthalmoscopy.macula.OS,
      postRetinaOd: formData.ophthalmoscopy.postRetina.OD,
      postRetinaOs: formData.ophthalmoscopy.postRetina.OS,
      vesselsOd: formData.ophthalmoscopy.vessels.OD,
      vesselsOs: formData.ophthalmoscopy.vessels.OS,
      peripheryOd: formData.ophthalmoscopy.periphery.OD,
      peripheryOs: formData.ophthalmoscopy.periphery.OS,
      vitreousOd: formData.ophthalmoscopy.vitreous.OD,
      vitreousOs: formData.ophthalmoscopy.vitreous.OS,

      // Refraction fields
      sphereOd: formData.refraction.sphere.OD,
      sphereOs: formData.refraction.sphere.OS,
      cylOd: formData.refraction.cyl.OD,
      cylOs: formData.refraction.cyl.OS,
      axisOd: formData.refraction.axis.OD,
      axisOs: formData.refraction.axis.OS,
      addOd: formData.refraction.add.OD,
      addOs: formData.refraction.add.OS,
      hPrismOd: formData.refraction.hPrism.OD,
      hPrismOs: formData.refraction.hPrism.OS,
      hBaseOd: formData.refraction.hBase.OD,
      hBaseOs: formData.refraction.hBase.OS,
      vPrismOd: formData.refraction.vPrism.OD,
      vPrismOs: formData.refraction.vPrism.OS,
      vBaseOd: formData.refraction.vBase.OD,
      vBaseOs: formData.refraction.vBase.OS,
      vcOd: formData.refraction.vc.OD,
      vcOs: formData.refraction.vc.OS,
      bcvaOd: formData.refraction.bcva.OD,
      bcvaOs: formData.refraction.bcva.OS,

      // Phorias fields
      distAtUnnamed: formData.phorias.distAt.unnamed,
      distAtHorizontal: formData.phorias.distAt.horizontal,
      distAtVertical: formData.phorias.distAt.vertical,
      distAtBase: formData.phorias.distAt.base,
      distAtRefEye: formData.phorias.distAt.refEye,
      nearAtUnnamed: formData.phorias.nearAt.unnamed,
      nearAtHorizontal: formData.phorias.nearAt.horizontal,
      nearAtVertical: formData.phorias.nearAt.vertical,
      nearAtBase: formData.phorias.nearAt.base,
      nearAtRefEye: formData.phorias.nearAt.refEye,
      phoriaMethodInput1: formData.phorias.method.input1,
      phoriaMethodInput2: formData.phorias.method.input2,
    };

    return payload;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = transformFormDataToPayload();
      await AddEyeExaminationApi(payload);
      setShowToast({
        show: true,
        message: "Preliminary test added successfully",
        status: "success",
      });
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setShowToast({  
        show: true,
        message: error.message,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Render OD/OS input pairs
  const renderODOSInputs = (section, field, label) => (
    <Box key={field} mb="4">
      <Text fontSize="14px" fontWeight="600" color="gray.700" mb="2">
        {label || formatFieldName(field)}
      </Text>
      <SimpleGrid columns={2} spacing={3}>
        <Input
          leftIcon={<FaNoteSticky />}
          label="OD"
          value={formData[section][field].OD}
          onChange={(e) => handleInputChange(section, field, "OD", e.target.value)}
          placeholder="Enter OD value"
        />
        <Input
          leftIcon={<FaNoteSticky />}
          label="OS"
          value={formData[section][field].OS}
          onChange={(e) => handleInputChange(section, field, "OS", e.target.value)}
          placeholder="Enter OS value"
        />
      </SimpleGrid>
    </Box>
  );

  // Render phorias inputs with special column structure
  const renderPhoriasInputs = (field, label) => {
    if (field === "method") {
      return (
        <Box key={field} mb="4">
          <Text fontSize="14px" fontWeight="600" color="gray.700" mb="2">
            {label || formatFieldName(field)}
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            <Input
              leftIcon={<FaNoteSticky />}
              label="Method Input 1"
              value={formData.phorias[field].input1}
              onChange={(e) => handlePhoriasChange(field, "input1", e.target.value)}
              placeholder="Method Input 1"
            />
            <Input
              leftIcon={<FaNoteSticky />}
              label="Method Input 2"
              value={formData.phorias[field].input2}
              onChange={(e) => handlePhoriasChange(field, "input2", e.target.value)}
              placeholder="Method Input 2"
            />
          </SimpleGrid>
        </Box>
      );
    }

    return (
      <Box key={field} mb="4">
        <Text fontSize="14px" fontWeight="600" color="gray.700" mb="2">
          {label || formatFieldName(field)}
        </Text>
        <SimpleGrid columns={5} spacing={3}>
          <Input
            leftIcon={<FaNoteSticky />}
            label="Unnamed"
            value={formData.phorias[field].unnamed}
            onChange={(e) => handlePhoriasChange(field, "unnamed", e.target.value)}
            placeholder="Unnamed"
          />
          <Input
            leftIcon={<FaNoteSticky />}
            label="Horizontal"
            value={formData.phorias[field].horizontal}
            onChange={(e) => handlePhoriasChange(field, "horizontal", e.target.value)}
            placeholder="Horizontal"
          />
          <Input
            leftIcon={<FaNoteSticky />}
            label="Vertical"
            value={formData.phorias[field].vertical}
            onChange={(e) => handlePhoriasChange(field, "vertical", e.target.value)}
            placeholder="Vertical"
          />
          <Input
            leftIcon={<FaNoteSticky />}
            label="Base"
            value={formData.phorias[field].base}
            onChange={(e) => handlePhoriasChange(field, "base", e.target.value)}
            placeholder="Base"
          />
          <Input
            leftIcon={<FaNoteSticky />}
            label="Ref Eye"
            value={formData.phorias[field].refEye}
            onChange={(e) => handlePhoriasChange(field, "refEye", e.target.value)}
            placeholder="Ref Eye"
          />
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <MainLayout>
      <Seo
        title="Add Eye Examination"
        description="Add new eye examination record"
      />

      {IsLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <PatientInfoCard />

        <Stack spacing={5} mt="32px">
          {/* Patient and Appointment Information */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Patient & Appointment Information
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
            
              <Input
                leftIcon={<FaNoteSticky />}
                label="Next Appointment Date"
                type="date"
                value={formData.nextAppointmentDate}
                onChange={(e) => handleGeneralInputChange("nextAppointmentDate", e.target.value)}
                placeholder="Select Next Appointment Date"
              />
            </SimpleGrid>
          </Box>
          {/* Biomicroscopic / Slit Lamp Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Biomicroscopic / Slit Lamp
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {Object.keys(formData.biomicroscopic).map((field) =>
                renderODOSInputs("biomicroscopic", field)
              )}
            </SimpleGrid>
          </Box>

          {/* Ophthalmoscopy / Fundus Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Ophthalmoscopy / Fundus
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {Object.keys(formData.ophthalmoscopy).map((field) =>
                renderODOSInputs("ophthalmoscopy", field)
              )}
            </SimpleGrid>
          </Box>

          {/* Refraction Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Refraction
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {Object.keys(formData.refraction).map((field) => {
                let label = null;
                if (field === "hPrism") label = "H-Prism";
                else if (field === "hBase") label = "H-Base";
                else if (field === "vPrism") label = "V-Prism";
                else if (field === "vBase") label = "V-Base";
                else if (field === "vc") label = "VC";
                else if (field === "bcva") label = "BCVA";
                
                return renderODOSInputs("refraction", field, label);
              })}
            </SimpleGrid>
          </Box>

          {/* Phorias Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Phorias
            </Text>
            <VStack spacing="6" align="stretch">
              {renderPhoriasInputs("distAt", "Dist at")}
              {renderPhoriasInputs("nearAt", "Near at")}
              {renderPhoriasInputs("method", "Method")}
            </VStack>
          </Box>

          <Flex justifyContent="center" mt={8}>
            <Button
              onClick={handleSubmit}
              isLoading={IsLoading}
              w={{ base: "100%", md: "184px" }}
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </Box>
    </MainLayout>
  );
}
