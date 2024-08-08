<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template match="/">
		<rss version="2.0">
			<channel>
				<title>Bizagi</title>
				<link>http://www.bizagi.com</link>
				<description>Business Agility</description> 
				<language>en</language>
				<docs>http://dev-lacidesg/BizAgiBPMWS/WebServices/wfman.asmx</docs>
				<managingEditor>lacidesg@visionsoftware.com.co</managingEditor>
				<generator>Bizagi</generator>
				<copyright>Bizagi 2005</copyright>
				<webMaster>lacidesg@visionsoftware.com.co</webMaster>
				<ttl>60</ttl>
				<image>
					<url>http://dev-lacidesg/BizAgiBPMWS/img/img/barra/Logo.jpg</url>
					<Title>Bizagi Pending WorkItems</Title>
					<link>http://www.bizagi.com</link>
				</image>
				<xsl:for-each select="workItems/workItem">
					<xsl:variable name="wisdate" select="workItemEstimatedSolutionDate" />
					<item>
						<title>
							<xsl:value-of select="task/taskDisplayName" />
						</title>
						<description>
							<img src="http://dev-lacidesg/BizAgiBPMWS/img/img/barra/Logo.jpg" />
							<br />
							<![CDATA[
							<br/>You have a new pending activity: <br />
							<b>
								]]><xsl:value-of select="task/taskDescription" /><![CDATA[
							</b>
							]]> 
						</description>
						<link>http://dev-lacidesg/BizAgiBPMWS/app/ListaDetalle/Detalle.aspx?idCase=<xsl:value-of select="process/processId" /></link>
						<pubDate>
							<xsl:call-template name="format-date">
								<xsl:with-param name="date" select="$wisdate" />
								<xsl:with-param name="format" select="3" />
							</xsl:call-template>
						</pubDate>
					</item>
				</xsl:for-each>
			</channel>
		</rss>
	</xsl:template>
	<!-- 1/8/04  01.08.04   Jan 8 2004 -->
	<!-- Param Date sample: 2005-08-31T20:54:02.1070000-05:00 -->
	<xsl:template name="format-date">
		<xsl:param name="date" />
		<xsl:param name="format" select="0" />
		<xsl:variable name="month" select="substring-before(substring-after($date, '-'), '-')" />
		<xsl:variable name="day" select="substring-before(substring-after(substring-after($date, '-'), '-'), 'T')" />
		<xsl:variable name="year" select="substring-before($date, '-')" />
		<xsl:variable name="monthName" select="substring(substring-after('01Jan02Feb03Mar04Apr05May06Jun07Jul08Aug09Sep10Oct11Nov12Dec', $month), 1, 3)" />
		<xsl:choose>
			<xsl:when test="$format = 1">
				<xsl:value-of select="concat($month, '/', $day, '/', substring($year, 3))" />
			</xsl:when>
			<xsl:when test="$format = 2">
				<xsl:value-of select="concat($monthName, '.', $day, '.', $year)" />
			</xsl:when>
			<xsl:when test="$format = 3">
				<xsl:value-of select="concat($monthName, ' ', $day)" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$date" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
